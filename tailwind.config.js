/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        sheet: 'var(--sheet)',
        ink: {
          DEFAULT: 'var(--ink)',
          2: 'var(--ink-2)',
          3: 'var(--ink-3)',
        },
        line: 'var(--line)',
        brand: {
          bright: 'var(--brand-bright)',
        },
        signal: {
          DEFAULT: 'var(--signal)',
          hover: 'var(--signal-hover)',
          ink: 'var(--signal-ink)',
          soft: 'var(--signal-soft)',
        },
        todo: {
          DEFAULT: 'var(--todo)',
          ink: 'var(--todo-ink)',
        },
        pill: {
          DEFAULT: 'var(--pill)',
          ink: 'var(--pill-ink)',
        },
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'Arial Narrow', 'sans-serif'],
        name: ['Instrument Serif', 'Georgia', 'serif'],
        body: ['Geist', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      maxWidth: {
        wrap: 'var(--wrap)',
        read: 'var(--read)',
      },
    },
  },
  plugins: [],
};
