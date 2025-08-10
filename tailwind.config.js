/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			fontFamily: {
				mono: ['Courier New', 'monospace'],
			},
			colors: {
				'craigslist-blue': '#0000EE',
				'craigslist-purple': '#551A8B',
				'craigslist-bg': '#FFFFFF',
			},
		},
	},
	plugins: [],
};
