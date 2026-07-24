import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Paleta "Plop! Neighborhood Bookstore" — variante Vibrant (Stitch).
        paper: {
          50: "#FDF8F0",
          100: "#FAF1E1",
          200: "#F3E4C8",
          300: "#EAD2A8",
          400: "#DEBB80",
          500: "#CFA05B",
          600: "#B98545",
          700: "#976A38",
          800: "#7A5530",
          900: "#63452A",
        },
        // kraft -> Kraft Brown (#93693B): estructural, bordes, texto secundario.
        kraft: {
          50: "#F7F1E9",
          100: "#EDE0CC",
          200: "#DBC29E",
          300: "#C6A374",
          400: "#AC864F",
          500: "#93693B",
          600: "#7A5731",
          700: "#614527",
          800: "#47331D",
          900: "#2E2113",
        },
        // mustard -> Mustard Yellow (#F2B705): color primario de acción (CTAs, logo, activos).
        mustard: {
          50: "#FEF8E1",
          100: "#FDEDB3",
          200: "#FBDD73",
          300: "#F8CC3D",
          400: "#F5BE17",
          500: "#F2B705",
          600: "#C99804",
          700: "#A07A03",
          800: "#765C02",
          900: "#4D3D02",
        },
        // accent-pink -> Pink sticker accent (#F2588C): badges "Destacado" / "Últimas unidades".
        "accent-pink": {
          50: "#FEEDF3",
          100: "#FCD1E1",
          200: "#F9A9C4",
          300: "#F681A6",
          400: "#F46F98",
          500: "#F2588C",
          600: "#D33E70",
          700: "#A83059",
          800: "#7D2342",
          900: "#52172B",
        },
        // Acentos adicionales de las pantallas Vibrant (badges "Nuevo" y confirmaciones de éxito).
        turquoise: "#22B8B0",
        "green-accent": "#7CB342",
        ink: {
          50: "#F4F2EF",
          100: "#E3DED7",
          200: "#C7BEB0",
          300: "#A69884",
          400: "#83725D",
          500: "#5C4E3F",
          600: "#493D31",
          700: "#3A2F24",
          800: "#2B221A",
          900: "#231C15",
        },
      },
    },
  },
  plugins: [],
};
export default config;
