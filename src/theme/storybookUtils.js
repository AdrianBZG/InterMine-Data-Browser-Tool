const createPalette = (c) => {
	const color = c.toLowerCase()
	const palette = {}

	for (let i = 0; i <= 9; i++) {
		const colorKey = `${color}${i}`
		palette[i] = `var(--${colorKey})`
	}

	return palette
}

export const solidPalette = {
	solidBlack: 'var(--solidBlack)',
	solidWhite: 'var(--solidWhite)',
}

export const greyPalette = createPalette('grey')
export const bluePalette = createPalette('blue')
export const greenPalette = createPalette('green')
export const purplePalette = createPalette('purple')
export const yellowPalette = createPalette('yellow')
export const orangePalette = createPalette('orange')
export const redPalette = createPalette('red')
export const pinkPalette = createPalette('pink')
