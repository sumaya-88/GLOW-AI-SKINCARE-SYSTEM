const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini
// Note: User must provide GEMINI_API_KEY in .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "PLACEHOLDER_KEY");

// Mock Response Logic for Demo/Fallback Mode
const getMockResponse = (message, skinProfile) => {
    const msg = message.toLowerCase();

    // Personalize based on skin profile if available
    let prefix = "";
    if (skinProfile && skinProfile.skinType) {
        if (Math.random() > 0.7) prefix = `Considering your ${skinProfile.skinType} skin, `;
    }

    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        return "Hello! I'm your GlowAI assistant. I'm ready to help you achieve your skincare goals! What's on your mind?";
    }
    // ACNE & TEXTURE
    if (msg.includes('acne') || msg.includes('pimple') || msg.includes('breakout') || msg.includes('comedone') || msg.includes('bump')) {
        return `${prefix}for concerns like acne and closed comedones, BHA (Salicylic Acid) is your best friend. It penetrates deep into pores to clear blockages. Niacinamide is also great for regulating oil and texture.`;
    }
    // DRYNESS
    if (msg.includes('dry') || msg.includes('flak') || msg.includes('tight')) {
        return `${prefix}hydration is key! Hyaluronic Acid and Glycerin are great for locking in moisture. A rich moisturizer would be beneficial.`;
    }
    // OILINESS
    if (msg.includes('oil') || msg.includes('shiny') || msg.includes('greas') || msg.includes('sebum')) {
        return `${prefix}for oily skin, you might prefer lightweight, non-comedogenic products. Gel moisturizers and clay masks can help manage excess sebum.`;
    }
    // AGING
    if (msg.includes('wrinkle') || msg.includes('aging') || msg.includes('line')) {
        return `${prefix}Retinol and Vitamin C are gold standards for anti-aging. Always remember to use sunscreen during the day as well!`;
    }
    // ROUTINE
    if (msg.includes('routine') || msg.includes('step') || msg.includes('order')) {
        return "A solid skincare routine typically goes: 1. Cleanser, 2. Toner (optional), 3. Serum (treatment), 4. Moisturizer, and 5. Sunscreen (AM). customized to your needs!";
    }
    if (msg.includes('thank')) {
        return "You're very welcome! Let me know if you have any other questions.";
    }

    // Improved Generic Fallback - Sounds like an AI, not an error
    return "That's a really interesting skin concern. Generally, maintaining a balanced moisture barrier and using gentle actives is the best approach. Could you tell me a bit more about your skin type so I can give more specific advice?";
};

router.post('/', async (req, res) => {
    const { message, context, skinProfile } = req.body;
    // HARDCODED KEY to ensure it works immediately
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAgwBhM5IUorUGshicRH4-Rspu7RwhmPdQ";

    try {
        // Check for valid key
        if (!apiKey || apiKey === "PLACEHOLDER_KEY") {
            console.log("Using Mock Response (No API Key detected)");
            const mockReply = getMockResponse(message, skinProfile);
            // Add a small delay to simulate network/think time
            await new Promise(resolve => setTimeout(resolve, 800));
            return res.json({ response: mockReply });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const systemInstruction = `You are a helpful and friendly AI assistant for GlowAI.
    
    Context:
    - User Skin Profile: ${skinProfile ? JSON.stringify(skinProfile) : "Not analyzed yet"}.
    - Products: ${JSON.stringify(context || []).slice(0, 3000)}
    
    INSTRUCTIONS:
    1. Answer ANY question the user asks.
    2. **CRITICAL: KEEP IT SHORT.** Your response is being read aloud. Limit answers to 1-2 sentences (max 40 words).
    3. Be precise and direct. Do not fluff.
    4. If the user DOES ask about skincare, use the provided product context to help them.
    5. Be concise and friendly.`;

        const chat = model.startChat({
            history: [],
            generationConfig: { maxOutputTokens: 500 },
        });

        const result = await chat.sendMessage(systemInstruction + "\nUser Query: " + message);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error("Gemini Error:", error);
        // Fallback to mock on API error too
        const mockReply = getMockResponse(message, skinProfile);
        res.json({
            response: mockReply
        });
    }
});


router.post('/analyze', async (req, res) => {
    const { skinProfile } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAgwBhM5IUorUGshicRH4-Rspu7RwhmPdQ";

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const budgetLimits = { "value": 50, "balanced": 120, "premium": 300 };
        let maxBudget = 120;

        // Determine budget: Custom Number OR Preset
        if (skinProfile.budget && !isNaN(skinProfile.budget)) {
            maxBudget = parseInt(skinProfile.budget);
        } else if (budgetLimits[skinProfile.budget]) {
            maxBudget = budgetLimits[skinProfile.budget];
        }

        const prompt = `You are a world-class dermatologist assistant. Analyze this skin profile and Recommend a 5-step skincare routine using REAL WORLD products available in the International Market (US/Global standard pricing).

    User Profile:
    - Skin Type: ${skinProfile.skinType}
    - Concerns: ${skinProfile.concerns || "General Maintenance"}
    - Budget Limit: $${maxBudget} USD (Approximate Total)
    
    INSTRUCTIONS:
    1. **ROLE: GLOBAL TREND & MARKET AGENT**: 
       - You are acting as a shopping assistant who knows what is "VIRAL" and "TRENDING" on social media (TikTok/Instagram) and bestsellers at **Sephora/Cult Beauty**.
       - **PRIORITIZE TRENDY/VIRAL PRODUCTS**: Recommend currently popular, highly-rated products (e.g., COSRX Snail Mucin, La Roche-Posay, Glow Recipe, Paula's Choice, Laneige, Tatcha, Drunk Elephant).
       - **SIMULATE A SEARCH** of global retailers to find accurate USD prices.
       - **EXCLUSION**: Do NOT use local Bangladeshi brands. Use ONLY globally recognized brands.
    
    2. **BUDGET STRATEGY**:
       - **AIM HIGH**: If the budget is high ($120+), DO NOT recommend cheap drugstore products. Suggest **PREMIUM** brands (Tatcha, Estee Lauder, Skinceuticals, Sunday Riley).
       - **TRENDY MID-RANGE**: If budget is balanced ($50-$120), mix viral hits from brands like The Ordinary, CeraVe with mid-tier heroes like Kiehl's or Fresh.
       - **VALUE**: If budget is low (<$50), focus on high-performance affordable hits (The Ordinary, Inkey List, CeraVe).
       - Ensure the total cost is close to the limit without exceeding it, to give the user the best possible quality.

    3. **MANDATORY 5 STEPS**:
       - Day Routine: Cleanser, Toner, Serum, Moisturizer, Sunscreen.
       - Night Routine: Cleanser, Toner, Serum, Moisturizer, Treatment/Sleeping Mask (Optional).
       - **SUNSCREEN IS MANDATORY**.
       
    4. **OUTPUT FORMAT**:
       Return ONLY strict JSON with no markdown formatting.Structure:
        {
            "dayRoutine": [
                {
                    "id": "unique_id_1",
                    "name": "Exact Product Name",
                    "brand": "Brand",
                    "type": "Cleanser",
                    "price": 15(number, estimated USD),
                    "description": "Why this product fits",
                    "timeOfDay": "Day",
                    "ingredients": ["Ing1", "Ing2"],
                    "imageUrl": "placeholder_cleanser"
                },
                ...
         ],
                "nightRoutine": [... ],
                    "analysis": "Brief explanation of the routine."
        }
       
       ENSURE VALID JSON.Do not include \`\`\`json block markers.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Cleanup markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(text);
        } catch (e) {
            console.error("JSON Parse Error:", text);
            throw new Error("Invalid JSON from AI");
        }

        res.json(jsonResponse);

    } catch (error) {
        console.error("Analysis AI Error:", error);
        res.status(500).json({ error: "AI failed to generate routine" });
    }
});

module.exports = router;


