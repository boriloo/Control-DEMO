/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  safelist: [
    { pattern: /^bg-\[/ }
  ],
  theme: {
    extend: {
      keyframes: {
        drop: {
          '0%': { transform: 'scale(1.15)' },
          '50%': { transform: 'scale(0.92)' },
          '75%': { transform: 'scale(1.04)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}

