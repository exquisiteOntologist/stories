module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx,css,scss,html}", "./index.html"],
    darkMode: "media", // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                gray: {
                    100: "#F8F6F6",
                },
            },
            keyframes: {
                wiggle: {
                    "0%": { transform: "translateY(0) rotateX(0deg)" },
                    "25%": { transform: "translateY(-30px) rotateX(90deg)" },
                    "50%": { transform: "translateY(0) rotateX(180deg)" },
                    "75%": { transform: "translateY(30px) rotateX(270deg)" },
                    "100%": { transform: "translateY(0) rotateX(360deg)" },
                },
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
