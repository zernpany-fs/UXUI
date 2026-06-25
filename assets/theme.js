/* Tailwind Play CDN config — load AFTER cdn.tailwindcss.com.
   Semantic colors map to CSS variables defined in styles.css so the
   same utility classes (bg-bg, text-text, border-border…) work in
   both light and dark themes. */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* raw brand swatches */
        porcelain: "rgb(var(--porcelain) / <alpha-value>)",
        baltic:    "rgb(var(--baltic) / <alpha-value>)",
        flagred:   "rgb(var(--flag-red) / <alpha-value>)",
        gold:      "rgb(var(--gold) / <alpha-value>)",
        shadow:    "rgb(var(--shadow) / <alpha-value>)",

        /* semantic (theme-aware) */
        bg:        "rgb(var(--bg) / <alpha-value>)",
        surface:   "rgb(var(--surface) / <alpha-value>)",
        surface2:  "rgb(var(--surface-2) / <alpha-value>)",
        border:    "rgb(var(--border) / <alpha-value>)",
        text:      "rgb(var(--text) / <alpha-value>)",
        muted:     "rgb(var(--text-muted) / <alpha-value>)",
        primary:   "rgb(var(--primary) / <alpha-value>)",
        "primary-hover": "rgb(var(--primary-hover) / <alpha-value>)",
        "on-primary":    "rgb(var(--on-primary) / <alpha-value>)",
        red:       "rgb(var(--accent-red) / <alpha-value>)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: { xl2: "1.125rem" },
      maxWidth: { content: "1200px" },
      keyframes: {
        "pulse-dot": {
          "0%,100%": { opacity: 1 },
          "50%": { opacity: .35 },
        },
      },
      animation: { "pulse-dot": "pulse-dot 1.6s ease-in-out infinite" },
    },
  },
};
