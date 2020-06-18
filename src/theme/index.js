import { createTheming } from '@callstack/react-theme-provider'

import { colors } from './colorPalette'
import { spacing } from './spacing'
import { darkTheme, lightTheme } from './theme'
import { fontLineHeights, fontSizes, fontWeights, getFontSize } from './typography'

const defaultTheme = {
	colors,
	spacing,
	darkTheme,
	lightTheme,
	fontLineHeights,
	fontSizes,
	fontWeights,
	getFontSize,
}

export const { ThemeProvider, withTheme, useTheme } = createTheming(defaultTheme)
