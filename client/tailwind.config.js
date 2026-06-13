/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          blush: "#F0C4CB",
          antiqueRose: "#C87D87",
          champagne: "#FBEAD6",
          thyme: "#6B7556",
          bisque: "#E5BCA9",
          
          gold: "#C87D87", // Antique Rose accent
          goldLight: "#F0C4CB", // Blush accent
          obsidian: "#FAF6F0", // Champagne Light background
          midnight: "#F3EBE0", // Bisque Darker background
          slate: "#FFFDFB", // Card backgrounds
          ivory: "#2C2A29", // Charcoal text
          gray: "#6B7556", // Dried Thyme text
          rose: "#C87D87",
          blue: "#6B7556",
          sage: "#6B7556"
        }
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        sans: ["'DM Sans'", "sans-serif"],
        accent: ["'Great Vibes'", "cursive"],
        mono: ["'JetBrains Mono'", "monospace"]
      },
      animation: {
        'shimmer': 'shimmer 2.5s infinite linear',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' }
        }
      }
    },
  },
  plugins: [],
}
