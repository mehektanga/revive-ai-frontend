/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        card: '#111827',
        cardBorder: '#1F2937',
        accentBlue: '#3B82F6',
        accentEmerald: '#10B981',
        accentRose: '#F43F5E',
        accentAmber: '#F59E0B',
      },
    },
  },
  plugins: [],
}
