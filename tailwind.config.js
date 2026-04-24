/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        leaf: "#10B981",
        cream: "#F5EEDC",
        gold: "#D4B16A",
        ink: "#111111",
        obsidian: "#0F0F0F"
      },
      fontFamily: {
        sans: ["Manrope_500Medium"],
        display: ["CormorantGaramond_600SemiBold"]
      }
    }
  },
  plugins: []
};
