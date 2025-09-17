/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        base: {
          DEFAULT: "#0f2027", // dipakai kalau pakai bg-base
          dark: "#0f2027",    // background utama
          mid: "#203a43",     // background gradasi
          light: "#2c5364",   // highlight ringan
          card: "#1a2d36",    // ✅ card & input disesuaikan biar nyatu
        },
        accent: {
          DEFAULT: "#00ADB5", // tombol utama, border aktif
          hover: "#06c2cb",   // efek hover tombol
          ring: "#00c8d1",    // ring focus
        },
        text: {
          light: "#DDDDDD",       // teks terang
          placeholder: "#9ca3af", // placeholder abu-abu
        },
        border: {
          accent: "#00ADB5", // border tabel & input
        },
      },
      backgroundImage: {
        "gradient-main":
          "linear-gradient(to bottom right, #0f2027, #203a43, #2c5364)",
      },
      keyframes: {
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "scale-out": {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.9)" },
        },
      },
      animation: {
        "scale-in": "scale-in 0.25s ease-out forwards",
        "scale-out": "scale-out 0.2s ease-in forwards",
      },
      kategori: {
        boy: {
          bg: "#1E3A8A", // biru tua elegan
          text: "#3B82F6", // biru terang
        },
        girl: {
          bg: "#831843", // pink tua elegan
          text: "#EC4899", // pink terang
        },
      },
    },
  },
  plugins: [],
};
