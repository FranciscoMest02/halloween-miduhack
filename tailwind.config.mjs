/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				"sgreen": "#43B929",
				"spurple": "#9B7EDE",
				"sgray": "#272D2D",
				"slightgray": "#50514F",
				"swhite": "#F6F8FF"
			}
		},
	},
	plugins: [],
}
