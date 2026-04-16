
import { createClient } from "@supabase/supabase-js";

// NOTE: These environment variables would normally be in a .env file
// Since we are mocking the backend for the demo, these are placeholders.
// To connect to a real backend, the user needs to provide:
// VITE_SUPABASE_URL
// VITE_SUPABASE_ANON_KEY

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder-url.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Mock Auth Service
 * Simulates backend calls for demonstration purposes since we don't have real credentials.
 */
export const mockAuthService = {
    async signIn({ email, password }: any) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (email === "user@example.com" && password === "password") {
            return {
                user: {
                    id: "1",
                    email: "user@example.com",
                    user_metadata: { full_name: "Jane Doe" }
                },
                error: null
            };
        }

        // Simulate error
        if (password !== "password") {
            return { user: null, error: { message: "Invalid login credentials" } };
        }

        return {
            user: {
                id: "2",
                email,
                user_metadata: { full_name: "New User" }
            },
            error: null
        };
    },

    async signUp({ email, data }: any) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
            user: {
                id: Math.random().toString(36).substr(2, 9),
                email,
                user_metadata: { ...data }
            },
            error: null
        };
    },

    async signOut() {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { error: null };
    }
};
