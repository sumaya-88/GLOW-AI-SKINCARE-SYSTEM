import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",

  ],

  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ['"Playfair Display"', "serif"],
        display: ['"Playfair Display"', "serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#E5989B", // Muted coral/pink
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        rose: {
          50: "#FAEEEA", // Exact light cream/pink background from image
          100: "#F5E0E0",
          200: "#F0AF8B", // Gradient end orange/peach
          300: "#E59090",
          400: "#DE7983", // Gradient start pink
          500: "#DB7082", // Primary brand pink (Skincare text, Icons)
          DEFAULT: "#DB7082",
        },
        sage: {
          50: "#F2F9F2", // Very light green
          100: "#E3F2E3",
          DEFAULT: "#8FB3A0", // Muted green
        },
        peach: {
          50: "#FFF5EF",
          100: "#FFE0D1",
        },
        stone: {
          800: "#402F26", // Deep Brand Brown
          500: "#8C8181", // Warm grey-brown
          900: "#2C2525", // Almost black brown
        },
        brown: {
          50: "#FAF7F7",
          100: "#F5F0F0",
          800: "#402F26",
          900: "#2C2525",
        },
        brown: {
          50: "#FAF7F7",
          100: "#F5F0F0",
          800: "#4A3B3B",
          900: "#2C2525",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
