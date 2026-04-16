const API_URL = "http://localhost:5000/api/auth";

export const api = {
    register: async (userData: any) => {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Registration failed");
        return data;
    },

    verifyOtp: async (email: string, otp: string) => {
        const response = await fetch(`${API_URL}/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Verification failed");
        return data;
    },

    resendOtp: async (email: string) => {
        const response = await fetch(`${API_URL}/resend-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to resend OTP");
        return data;
    },

    login: async (credentials: any) => {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Login failed");
        return data;
    },

    getProfile: async () => {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${API_URL}/profile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch profile");
        return data;
    },

    updateProfile: async (data: any) => {
        const response = await fetch(`${API_URL}/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to update profile");
        return response.json();
    },

    startStreak: async () => {
        const response = await fetch(`${API_URL}/start-routine`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });
        if (!response.ok) throw new Error("Failed to start streak");
        return response.json();
    },
};
