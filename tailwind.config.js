/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/frontend/**/*.{html,jsx}"],
	theme: {
		extend: {},
	},
	plugins: [
		require("@tailwindcss/forms"),
		require("@tailwindcss/typography"),
		require("@tailwindcss/aspect-ratio"),
		require("@tailwindcss/line-clamp"),
	],
};
