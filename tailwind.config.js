/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F1F2E",
        pine: "#0E6B5C",
        pinedeep: "#0A4F44",
        pinelite: "#E8F5F3",
        amber: "#E8A33D",
        mist: "#F0F7F5",
        line: "#DDE8E5",
        whatsapp: "#25D366",
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
      boxShadow: {
        card: "0 2px 12px rgba(14,107,92,0.08)",
        "card-hover": "0 8px 25px rgba(14,107,92,0.15)",
      },
    },
  },
  plugins: [],
};
