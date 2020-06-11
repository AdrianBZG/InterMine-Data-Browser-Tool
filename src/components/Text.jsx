import { cx } from 'linaria'
import { styled } from 'linaria/react'
import PropTypes from 'prop-types'
import React from 'react'

import { screenreaderOnly } from '../theme/utils'

const StyledText = styled.div`
	font-size: ${(props) => props.size};
	line-height: ${(props) => props.lineHeight};
	font-weight: ${(props) => props.fontWeight};
`

export const Text = ({
	as,
	fontSize,
	isMobile,
	lineHeight,
	children,
	className,
	fontWeight,
	screenreaderOnly: visuallyHidden,
}) => {
	const platform = isMobile ? 'mobile' : 'desktop'
	let weight = 400 // medium
	let lh = 1.5 // regular

	if (lineHeight === 'condensed') lh = 1.25
	if (lineHeight === 'condensed-ultra') lh = 1

	if (fontWeight === 'medium') weight = 500
	if (fontWeight === 'semibold') weight = 600
	if (fontWeight === 'bold') weight = 700

	return (
		<StyledText
			className={cx(className, visuallyHidden && screenreaderOnly)}
			as={as}
			size={textSizes[platform][fontSize]}
			fontWeight={weight}
			lineHeight={lh}
		>
			{children}
		</StyledText>
	)
}

const textSizes = {
	desktop: {
		'00': '48px',
		'0': '40px',
		'1': '32px',
		'2': '24px',
		'3': '20px',
		'4': '16px',
		'5': '14px',
		'6': '12px',
	},
	mobile: {
		'00': '40px',
		'0': '32px',
		'1': '26px',
		'2': '22px',
		'3': '18px',
		'4': '16px',
		'5': '14px',
		'6': '12px',
	},
}

Text.propTypes = {
	as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div']),
	// in decreasing order of size
	fontSize: PropTypes.oneOf(['00', '0', '1', '2', '3', '4', '5', '6']),
	isMobile: PropTypes.bool,
	lineHeight: PropTypes.oneOf(['default', 'condensed', 'condensed-ultra']),
	weight: PropTypes.oneOf(['regular', 'medium', 'semibold', 'bold']),
	screenreaderOnly: PropTypes.bool,
}

Text.defaultProps = {
	as: 'p',
	fontSize: '4',
	isMobile: false,
	lineHeight: 'default',
	fontWeight: 'regular',
	screenreaderOnly: false,
}
