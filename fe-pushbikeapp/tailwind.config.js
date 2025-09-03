/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      theme: {
        extend: {
          colors: {
            base: {
              DEFAULT: "#0f2027", // gradient start
              via: "#203a43",     // gradient middle
              to: "#2c5364",      // gradient end
              dark: "#121a24",    // modal/input bg
              darker: "#1b252f",  // card bg
            },
            accent: "#00ADB5",      // teal accent
            textlight: "#DDDDDD",   // soft text
          },
          fontFamily: {
            poppins: ["Poppins", "sans-serif"],
          },
        },
      },
    }
  },
  plugins: [],
};
