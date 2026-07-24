/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Shadcn CSS variable mappings ──────────────────────────
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          // ── Custom branded palette ─────────────────────────────
          50: "#fdf2f4",
          100: "#fce7eb",
          200: "#f9d0d9",
          300: "#f4a9ba",
          400: "#ed7a96",
          500: "#E8B4BC",
          600: "#d4868f",
          700: "#b56370",
          800: "#97535e",
          900: "#7f4752",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          // ── Custom branded palette ─────────────────────────────
          50: "#f5f3f8",
          100: "#ebe7f1",
          200: "#d9d0e5",
          300: "#bfb0d3",
          400: "#a18bbd",
          500: "#957DAD",
          600: "#7a5f94",
          700: "#654d7a",
          800: "#544165",
          900: "#473855",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          light: "#F0E6EF",
          dark: "#d4868f",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // ── Other custom colors ────────────────────────────────────
        verde: {
          light: "#A8E6CF",
          DEFAULT: "#4CAF50",
          dark: "#2E7D32",
        },
        azul: {
          light: "#E3F2FD",
          DEFAULT: "#2196F3",
          dark: "#1565C0",
        },
        success: "#A8E6CF",
        warning: "#FFD93D",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
      },
      ringWidth: {
        3: "3px",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(232, 180, 188, 0.15)",
        medium: "0 8px 30px rgba(149, 125, 173, 0.2)",
      },
    },
  },
  plugins: [],
};
