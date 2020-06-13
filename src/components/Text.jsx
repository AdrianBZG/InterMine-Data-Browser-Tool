import { styled } from 'linaria/react'
import PropTypes from 'prop-types'
import React from 'react'

import { fontSizes } from '../theme'

export const Div = styled.div`
	font-size: ${({ isMobile, fontSize }) => getFontSize(isMobile, fontSize)};
	line-height: ${({ lineHeight }) => getLineHeight(lineHeight)};
	font-weight: ${({ fontWeight }) => getFontWeight(fontWeight)};
`

// expose semantically correct variants
export const H1 = (props) => React.cloneElement(<Div />, { ...props, as: 'h1' })
export const H2 = (props) => React.cloneElement(<Div />, { ...props, as: 'h2' })
export const H3 = (props) => React.cloneElement(<Div />, { ...props, as: 'h3' })
export const H4 = (props) => React.cloneElement(<Div />, { ...props, as: 'h4' })
export const H5 = (props) => React.cloneElement(<Div />, { ...props, as: 'h5' })
export const H6 = (props) => React.cloneElement(<Div />, { ...props, as: 'h6' })
export const P = (props) => React.cloneElement(<Div />, { ...props, as: 'p' })
export const Span = (props) => React.cloneElement(<Div />, { ...props, as: 'span' })

const getFontWeight = (weight) => {
	switch (weight) {
		case 'medium':
			return 500
		case 'semibold':
			return 600
		case 'bold':
			return 700
		default:
			return 400
	}
}

const getLineHeight = (height) => {
	switch (height) {
		case 'condensed':
			return 1.25
		case 'condensed-ultra':
			return 1
		default:
			return 1.5
	}
}

const getFontSize = (isMobile, fontSize) => {
	const platform = isMobile ? 'mobile' : 'desktop'
	return fontSizes[platform][fontSize]
}

const commonPropTypes = {
	// in decreasing order of size
	fontSize: PropTypes.oneOf(['xsmall', 'small', 'medium', 'regular', 'large', 'xlarge', 'xxlarge']),
	isMobile: PropTypes.bool,
	lineHeight: PropTypes.oneOf(['default', 'condensed', 'condensed-ultra']),
	weight: PropTypes.oneOf(['regular', 'medium', 'semibold', 'bold']),
}

const commonProps = {
	fontSize: 'medium',
	isMobile: false,
	lineHeight: 'default',
	fontWeight: 'regular',
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

H1.defaultProps = { ...commonProps }
H2.defaultProps = { ...commonProps }
H3.defaultProps = { ...commonProps }
H4.defaultProps = { ...commonProps }
H5.defaultProps = { ...commonProps }
H6.defaultProps = { ...commonProps }
P.defaultProps = { ...commonProps }
Span.defaultProps = { ...commonProps }
Div.defaultProps = { ...commonProps }
