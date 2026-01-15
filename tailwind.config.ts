import type { Config } from "tailwindcss";

export default {
  darkMode: ["class", '[data-theme="cosmic-dark"]'],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // Cosmic theme colors
        cosmic: {
          purple: {
            DEFAULT: '#8B5CF6',
            light: '#A78BFA',
            dark: '#7C3AED',
          },
          pink: {
            DEFAULT: '#EC4899',
            light: '#F472B6',
            dark: '#DB2777',
          },
          cyan: {
            DEFAULT: '#22D3EE',
            light: '#67E8F9',
            dark: '#0891B2',
          },
          amber: {
            DEFAULT: '#F59E0B',
            light: '#FBBF24',
            dark: '#D97706',
          },
          bg: {
            deep: 'var(--cosmic-bg-deep)',
            primary: 'var(--cosmic-bg-primary)',
            secondary: 'var(--cosmic-bg-secondary)',
            tertiary: 'var(--cosmic-bg-tertiary)',
            elevated: 'var(--cosmic-bg-elevated)',
          },
          surface: {
            DEFAULT: 'var(--cosmic-surface)',
            light: 'var(--cosmic-surface-light)',
            glass: 'var(--cosmic-surface-glass)',
          },
          text: {
            primary: 'var(--cosmic-text-primary)',
            secondary: 'var(--cosmic-text-secondary)',
            tertiary: 'var(--cosmic-text-tertiary)',
            muted: 'var(--cosmic-text-muted)',
          },
          border: {
            DEFAULT: 'var(--cosmic-border)',
            light: 'var(--cosmic-border-light)',
            glow: 'var(--cosmic-border-glow)',
          },
        },
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
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-15px)",
          },
        },
        "spin-slow": {
          to: {
            transform: "rotate(360deg)",
          },
        },
        "pulse-slow": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.7",
          },
        },
        "pulse-slower": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.5",
          },
        },
        "fade-in": {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        "fade-in-up": {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-up": {
          from: {
            transform: "translateY(20px)",
            opacity: "0.5",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        // Cosmic animations
        "cosmic-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)",
          },
        },
        "cosmic-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "cosmic-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        "cosmic-shimmer": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "cosmic-twinkle": {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        "cosmic-gradient": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 5s ease-in-out infinite",
        "float-slow": "float 7s ease-in-out infinite",
        "float-slower": "float 9s ease-in-out infinite",
        "spin-slow": "spin-slow 10s linear infinite",
        "pulse-slow": "pulse-slow 5s ease-in-out infinite",
        "pulse-slower": "pulse-slower 7s ease-in-out infinite",
        "fade-in": "fade-in 0.7s ease-in-out forwards",
        "fade-in-delay": "fade-in 0.7s ease-in-out 0.3s forwards",
        "fade-in-up": "fade-in-up 0.7s ease-out forwards",
        "slide-up": "slide-up 0.7s ease-out forwards",
        "slide-up-delay": "slide-up 0.7s ease-out 0.3s forwards",
        // Cosmic animations
        "cosmic-glow": "cosmic-glow 2s ease-in-out infinite",
        "cosmic-float": "cosmic-float 3s ease-in-out infinite",
        "cosmic-float-slow": "cosmic-float 5s ease-in-out infinite",
        "cosmic-pulse": "cosmic-pulse 2s ease-in-out infinite",
        "cosmic-shimmer": "cosmic-shimmer 2s linear infinite",
        "cosmic-twinkle": "cosmic-twinkle 2s ease-in-out infinite",
        "cosmic-gradient": "cosmic-gradient 5s ease infinite",
      },
      // Cosmic shadow utilities
      boxShadow: {
        'cosmic-sm': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'cosmic-md': '0 4px 16px rgba(0, 0, 0, 0.4)',
        'cosmic-lg': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'cosmic-glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'cosmic-glow-pink': '0 0 20px rgba(236, 72, 153, 0.3)',
        'cosmic-glow-cyan': '0 0 20px rgba(34, 211, 238, 0.3)',
      },
      // Cosmic backdrop blur utilities
      backdropBlur: {
        'cosmic-sm': '8px',
        'cosmic-md': '16px',
        'cosmic-lg': '32px',
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
