import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontSize: {
        "typ-display": [
          "var(--font-tier-display-size)",
          {
            lineHeight: "var(--font-tier-display-leading)",
            letterSpacing: "var(--font-tier-display-tracking)",
          },
        ],
        "typ-overline": [
          "var(--font-tier-overline-size)",
          {
            lineHeight: "var(--font-tier-overline-leading)",
            letterSpacing: "var(--font-tier-overline-tracking)",
          },
        ],
        "typ-shell-title": [
          "var(--font-tier-shell-title-size)",
          {
            lineHeight: "var(--font-tier-shell-title-leading)",
            letterSpacing: "var(--font-tier-shell-title-tracking)",
          },
        ],
        "typ-panel-title": [
          "var(--font-tier-panel-title-size)",
          {
            lineHeight: "var(--font-tier-panel-title-leading)",
            letterSpacing: "var(--font-tier-panel-title-tracking)",
          },
        ],
        "typ-section-title": [
          "var(--font-tier-section-title-size)",
          {
            lineHeight: "var(--font-tier-section-title-leading)",
            letterSpacing: "var(--font-tier-section-title-tracking)",
          },
        ],
        "typ-card-title": [
          "var(--font-tier-card-title-size)",
          {
            lineHeight: "var(--font-tier-card-title-leading)",
            letterSpacing: "var(--font-tier-card-title-tracking)",
          },
        ],
        "typ-highlight": [
          "var(--font-tier-highlight-size)",
          {
            lineHeight: "var(--font-tier-highlight-leading)",
            letterSpacing: "var(--font-tier-highlight-tracking)",
          },
        ],
        "typ-metric": [
          "var(--font-tier-metric-size)",
          {
            lineHeight: "var(--font-tier-metric-leading)",
            letterSpacing: "var(--font-tier-metric-tracking)",
          },
        ],
        "typ-body": [
          "var(--font-tier-body-size)",
          {
            lineHeight: "var(--font-tier-body-leading)",
            letterSpacing: "var(--font-tier-body-tracking)",
          },
        ],
        "typ-body-relaxed": [
          "var(--font-tier-body-relaxed-size)",
          {
            lineHeight: "var(--font-tier-body-relaxed-leading)",
            letterSpacing: "var(--font-tier-body-relaxed-tracking)",
          },
        ],
        "typ-ui": [
          "var(--font-tier-ui-size)",
          {
            lineHeight: "var(--font-tier-ui-leading)",
            letterSpacing: "var(--font-tier-ui-tracking)",
          },
        ],
        "typ-ui-snug": [
          "var(--font-tier-ui-snug-size)",
          {
            lineHeight: "var(--font-tier-ui-snug-leading)",
            letterSpacing: "var(--font-tier-ui-snug-tracking)",
          },
        ],
        "typ-micro": [
          "var(--font-tier-micro-size)",
          {
            lineHeight: "var(--font-tier-micro-leading)",
            letterSpacing: "var(--font-tier-micro-tracking)",
          },
        ],
        "typ-input": [
          "var(--font-tier-input-size)",
          {
            lineHeight: "var(--font-tier-input-leading)",
            letterSpacing: "var(--font-tier-input-tracking)",
          },
        ],
      },
    },
  },
  plugins: [],
};

export default config;
