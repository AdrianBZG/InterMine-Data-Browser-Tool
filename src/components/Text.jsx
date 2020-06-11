import { cx } from 'linaria'
import { styled } from 'linaria/react'
import PropTypes from 'prop-types'
import React from 'react'

import { fontSizes } from '../theme/fontSizes'
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
	style,
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
			size={fontSizes[platform][fontSize]}
			fontWeight={weight}
			lineHeight={lh}
			// this is required so css can be overridden by the consumer, it is not used by us,
			// only passed forward
			style={style}
		>
			{children}
		</StyledText>
	)
}

// semantically correct variants
const H1 = (props) => React.cloneElement(<Text />, { ...props, as: 'h1' })
const H2 = (props) => React.cloneElement(<Text />, { ...props, as: 'h2' })
const H3 = (props) => React.cloneElement(<Text />, { ...props, as: 'h3' })
const H4 = (props) => React.cloneElement(<Text />, { ...props, as: 'h4' })
const H5 = (props) => React.cloneElement(<Text />, { ...props, as: 'h5' })
const H6 = (props) => React.cloneElement(<Text />, { ...props, as: 'h6' })
const P = (props) => React.cloneElement(<Text />, { ...props, as: 'p' })
const Span = (props) => React.cloneElement(<Text />, { ...props, as: 'span' })
const Div = (props) => React.cloneElement(<Text />, { ...props, as: 'div' })

// expose semantically correct elements for the user
Text.H1 = H1
Text.H2 = H2
Text.H3 = H3
Text.H4 = H4
Text.H5 = H5
Text.H6 = H6
Text.P = P
Text.Span = Span
Text.Div = Div

const commonPropTypes = {
	// in decreasing order of size
	fontSize: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']),
	isMobile: PropTypes.bool,
	lineHeight: PropTypes.oneOf(['default', 'condensed', 'condensed-ultra']),
	weight: PropTypes.oneOf(['regular', 'medium', 'semibold', 'bold']),
	screenreaderOnly: PropTypes.bool,
}

const commonProps = {
	fontSize: 'medium',
	isMobile: false,
	lineHeight: 'default',
	fontWeight: 'regular',
	screenreaderOnly: false,
}

Text.propTypes = {
	as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div']),
	...commonPropTypes,
}

H1.propTypes = { ...commonPropTypes }
H2.propTypes = { ...commonPropTypes }
H3.propTypes = { ...commonPropTypes }
H4.propTypes = { ...commonPropTypes }
H5.propTypes = { ...commonPropTypes }
H6.propTypes = { ...commonPropTypes }
P.propTypes = { ...commonPropTypes }
Span.propTypes = { ...commonPropTypes }
Div.propTypes = { ...commonPropTypes }

Text.defaultProps = { as: 'p', ...commonProps }
H1.defaultProps = { ...commonProps }
H2.defaultProps = { ...commonProps }
H3.defaultProps = { ...commonProps }
H4.defaultProps = { ...commonProps }
H5.defaultProps = { ...commonProps }
H6.defaultProps = { ...commonProps }
P.defaultProps = { ...commonProps }
Span.defaultProps = { ...commonProps }
Div.defaultProps = { ...commonProps }
