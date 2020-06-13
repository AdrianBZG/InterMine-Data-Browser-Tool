import { addons } from '@storybook/addons'
import { themes } from '@storybook/theming'

const fontBase = [
	'-apple-system',
	'BlinkMacSystemFont',
	'Segoe UI',
	'Roboto',
	'Oxygen',
	'Ubuntu',
	'Cantarell',
	'Fira Sans',
	'Droid Sans',
	'Helvetica Neue',
	'sans-serif',
].join(', ')

themes.light.fontBase = fontBase

addons.setConfig({
	theme: themes.light,
})
