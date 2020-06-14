export const fontSizes = {
	desktop: {
		s1: '12px',
		s2: '14px',
		m1: '16px',
		m2: '20px',
		m3: '24px',
		l1: '32px',
		l2: '40px',
		l3: '48px',
	},
	mobile: {
		s1: '12px',
		s2: '14px',
		m1: '16px',
		m2: '18px',
		m3: '22px',
		l1: '26px',
		l2: '32px',
		l3: '40px',
	},
}

export const fontWeights = {
	medium: 500,
	semibold: 600,
	bold: 700,
	regular: 400,
}

export const fontLineHeights = {
	condensed: 1.25,
	'condensed-ultra': 1,
	default: 1,
}

export const getFontSize = (isMobile, fontSize) => {
	const platform = isMobile ? 'mobile' : 'desktop'
	return fontSizes[platform][fontSize]
}
