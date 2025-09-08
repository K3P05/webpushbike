// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        base: {
          dark: "#0f2027",   // bg utama
          mid: "#203a43",    // bg gradasi
          light: "#2c5364",  // highlight ringan
          card: "#1b252f",   // card & input
        },
        accent: "#00ADB5",   // tombol utama, border aktif
        textlight: "#DDDDDD", // teks terang
      },
      backgroundImage: {
        "gradient-main": "linear-gradient(to bottom right, #0f2027, #203a43, #2c5364)",
      },
    },
  },
  plugins: [],
};
