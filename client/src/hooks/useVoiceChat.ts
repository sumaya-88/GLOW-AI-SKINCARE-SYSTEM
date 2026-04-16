import { useState, useCallback, useRef, useEffect } from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface UseVoiceChatOptions {
    questionnaireData?: {
        skinType?: string;
        concerns?: string[];
        goals?: string;
        budget?: string;
    };
    onRoutineUpdateSuggested?: () => void;
}

// Web Speech API interfaces
interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

interface ISpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onend: (() => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

declare global {
    interface Window {
        SpeechRecognition: new () => ISpeechRecognition;
        webkitSpeechRecognition: new () => ISpeechRecognition;
    }
}

export function useVoiceChat(options: UseVoiceChatOptions = {}) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');

    const recognitionRef = useRef<ISpeechRecognition | null>(null);

    // Initialize speech recognition
    useEffect(() => {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognitionAPI) {
            recognitionRef.current = new SpeechRecognitionAPI();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
                const current = event.resultIndex;
                const transcriptText = event.results[current][0].transcript;
                setTranscript(transcriptText);

                if (event.results[current].isFinal) {
                    sendMessage(transcriptText);
                    setTranscript('');
                }
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
            window.speechSynthesis.cancel();
        };
    }, []);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            setTranscript('');
            recognitionRef.current.start();
            setIsListening(true);
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, [isListening]);

    const speak = useCallback((text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            // Clean text of markdown AND emojis for better TTS
            const cleanText = text
                .replace(/[*#]/g, '')
                .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ''); // Remove emojis

            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.rate = 1;
            utterance.pitch = 1.1; // Slightly higher/friendly pitch
            utterance.volume = 1;

            // Try to use a female voice
            const voices = window.speechSynthesis.getVoices();
            const femaleVoice = voices.find(v =>
                v.name.includes('Google US English') ||
                v.name.includes('Samantha') ||
                v.name.includes('Female') ||
                v.name.includes('Zira')
            );

            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const stopSpeaking = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }, []);

    // Stop speaking when window is minimized/hidden
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;

        // STOP SPEAKING IMMEDIATELY when user sends new input
        window.speechSynthesis.cancel();
        setIsSpeaking(false);

        const userMessage: Message = { role: 'user', content: content.trim() };
        // Optimistically update UI
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            // DIRECT GEMINI API CALL (Bypassing stale server)
            // Using 'gemini-flash-latest' as verified available model alias
            const API_KEY = "AIzaSyAgwBhM5IUorUGshicRH4-Rspu7RwhmPdQ";

            // Construct history for Gemini
            // We map 'assistant' role to 'model' for Gemini API
            const history = messages.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }));

            // Check if the PREVIOUS message from assistant asked for an update
            const lastAssistantMessage = messages.length > 0 && messages[messages.length - 1].role === 'assistant'
                ? messages[messages.length - 1].content
                : "";

            let systemPrompt = `You are GlowAI, an expert Skincare Consultant.
            - Context: User Skin Profile = ${options.questionnaireData ? JSON.stringify(options.questionnaireData) : "Not analyzed yet"}.
            - Your Goal: Provide expert, science-backed skincare advice.
            - BEHAVIOR:
                1. **CRITICAL: KEEP ANSWERS SHORT.** Max 2-3 sentences.
                2. Be precise. No fluff.
                3. If the user mentions a skin issue, recommend SPECIFIC popular brands.
                4. AFTER recommending a product, ASK if they want to update their routine.
                5. IF the user wants update, use tag: [[ASK_UPDATE]].
            - MEMORY: Remember previous context.`;

            // If the user is responding "yes" to a routine update request
            if (content.toLowerCase().includes('yes') && lastAssistantMessage.includes('update your routine')) {
                systemPrompt += `
                 IMPORTANT: The user just agreed to update their routine.
                 Please generate a JSON object representing the NEW routine based on our discussion.
                 Format:
                 \`\`\`json
                 {
                    "dayRoutine": [{ "id": "...", "type": "...", "name": "...", "brand": "..." }],
                    "nightRoutine": [{ "id": "...", "type": "...", "name": "...", "brand": "..." }]
                 }
                 \`\`\`
                 Output ONLY the JSON. Do not add extra text.`;
            }

            // Add the new user message to history
            const currentTurn = {
                role: 'user',
                parts: [{
                    text: `User Query: ${content}
                    
                    SYSTEM INSTRUCTION: ${systemPrompt}`
                }]
            };

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [...history, currentTurn]
                })
            });

            const data = await response.json();

            // Parse Gemini Response
            let assistantContent = "I'm having trouble thinking right now.";
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                assistantContent = data.candidates[0].content.parts[0].text;
            }

            // Check for JSON (Routine Update)
            if (assistantContent.includes('```json')) {
                try {
                    const jsonMatch = assistantContent.match(/```json\n([\s\S]*?)\n```/);
                    if (jsonMatch && jsonMatch[1]) {
                        const newRoutine = JSON.parse(jsonMatch[1]);
                        console.log("New Routine Received:", newRoutine);

                        // Clean the message to show to user
                        assistantContent = "I've updated your routine with the new recommendations! Check the Routine page to see the changes.";

                        // Trigger update callback
                        if (options.onRoutineUpdateSuggested) {
                            // We need to pass the new routine data back. 
                            // Since the interface currently doesn't support arguments, we might need to update it or use a custom event.
                            // For now, let's save to localStorage directly to ensure it works.
                            localStorage.setItem("glowai_routine", JSON.stringify(newRoutine));

                            // Dispatch event for instant UI update if components are listening
                            window.dispatchEvent(new CustomEvent('routine-updated', { detail: newRoutine }));

                            options.onRoutineUpdateSuggested();
                        }
                    }
                } catch (e) {
                    console.error("Failed to parse routine JSON", e);
                    assistantContent = "I tried to update your routine but something went wrong. Let's try again.";
                }
            }

            // Remove the [[ASK_UPDATE]] tag for display
            const displayContent = assistantContent.replace('[[ASK_UPDATE]]', '').trim();

            const botMessage: Message = { role: 'assistant', content: displayContent };
            setMessages(prev => [...prev, botMessage]);

            // Speak the response
            speak(displayContent);

            // Handle UI quirks based on tags
            if (assistantContent.includes('[[ASK_UPDATE]]')) {
                // You could trigger a UI button "Update Routine?" here if you wanted
                // For now, we rely on the user saying "Yes"
            }

        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to Google Gemini directly. Please check your internet connection." }]);
        } finally {
            setIsLoading(false);
        }
    }, [messages, options.questionnaireData, speak, options]);

    const replayLastMessage = useCallback(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
            speak(lastMessage.content);
        }
    }, [messages, speak]);

    return {
        messages,
        isLoading,
        isListening,
        isSpeaking,
        transcript,
        startListening,
        stopListening,
        sendMessage,
        speak,
        stopSpeaking,
        replayLastMessage,
        setMessages,
    };
}
