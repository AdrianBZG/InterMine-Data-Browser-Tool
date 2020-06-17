const solidPalette = {
	solidBlack: '#10161a',
	solidWhite: '#ffffff',
}

const greyPalette = {
	grey000: '#fafbfc',
	grey100: '#f6f8fa',
	grey200: '#e1e4e8',
	grey300: '#d1d5da',
	grey400: '#959da5',
	grey500: '#6a737d',
	grey600: '#586069',
	grey700: '#444d56',
	grey800: '#2f363d',
	grey900: '#24292e',
}

const bluePalette = {
	blue000: '#f1f8ff',
	blue100: '#dbedff',
	blue200: '#c8e1ff',
	blue300: '#79b8ff',
	blue400: '#2188ff',
	blue500: '#0366d6',
	blue600: '#005cc5',
	blue700: '#044289',
	blue800: '#032f62',
	blue900: '#05264c',
}

const greenPalette = {
	green000: '#f0fff4',
	green100: '#dcffe4',
	green200: '#bef5cb',
	green300: '#85e89d',
	green400: '#34d058',
	green500: '#28a745',
	green600: '#22863a',
	green700: '#176f2c',
	green800: '#165c26',
	green900: '#144620',
}

const purplePalette = {
	purple000: '#f5f0ff',
	purple100: '#e6dcfd',
	purple200: '#d1bcf9',
	purple300: '#b392f0',
	purple400: '#8a63d2',
	purple500: '#6f42c1',
	purple600: '#5a32a3',
	purple700: '#4c2889',
	purple800: '#3a1d6e',
	purple900: '#29134e',
}

const yellowPalette = {
	yellow000: '#fffdef',
	yellow100: '#fffbdd',
	yellow200: '#fff5b1',
	yellow300: '#ffea7f',
	yellow400: '#ffdf5d',
	yellow500: '#ffd33d',
	yellow600: '#f9c513',
	yellow700: '#dbab09',
	yellow800: '#b08800',
	yellow900: '#735c0f',
}

const orangePalette = {
	orange000: '#fff8f2',
	orange100: '#ffebda',
	orange200: '#ffd1ac',
	orange300: '#ffab70',
	orange400: '#fb8532',
	orange500: '#f66a0a',
	orange600: '#e36209',
	orange700: '#d15704',
	orange800: '#c24e00',
	orange900: '#a04100',
}

const redPalette = {
	red000: '#ffeef0',
	red100: '#ffdce0',
	red200: '#fdaeb7',
	red300: '#f97583',
	red400: '#ea4a5a',
	red500: '#d73a49',
	red600: '#cb2431',
	red700: '#b31d28',
	red800: '#9e1c23',
	red900: '#86181d',
}

const pinkPalette = {
	pink000: '#ffeef8',
	pink100: '#fedbf0',
	pink200: '#f9b3dd',
	pink300: '#f692ce',
	pink400: '#ec6cb9',
	pink500: '#ea4aaa',
	pink600: '#d03592',
	pink700: '#b93a86',
	pink800: '#99306f',
	pink900: '#6d224f',
}

export const colors = {
	bluePalette,
	yellowPalette,
	greenPalette,
	redPalette,
	greyPalette,
	solidPalette,
	purplePalette,
	orangePalette,
	pinkPalette,
}

/**
 * Storybook utils
 */
export const getStorybookPalette = (palette) =>
	Object.keys(palette).reduce((allColors, nextColor, idx) => {
		allColors[`${idx}`] = palette[nextColor]

		return allColors
	}, {})

export const allColors = Object.values(colors).reduce((c, nc) => ({ ...nc, ...c }), {})

export const getColorFromPalette = (color) => {
	return colors[color.replace(/\d+/, 'Palette')][color]
}
