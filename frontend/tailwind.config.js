/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eef4ff",
          100: "#dbe6ff",
          500: "#3b6cf6",
          600: "#2553e0",
          700: "#1a3fb8",
          900: "#0f1f5b",
        },
      },
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] },
      boxShadow: { soft: "0 6px 24px -8px rgba(15,31,91,0.18)" },
    },
  },
  plugins: [],
};