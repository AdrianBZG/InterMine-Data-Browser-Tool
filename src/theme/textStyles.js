import { styled } from 'linaria/react'
import PropTypes from 'prop-types'
import React from 'react'

const StyledText = styled.div`
	font-size: ${(props) => props.size};
`

export const Text = ({ as, size, isMobile, children }) => {
	const platform = isMobile ? 'mobile' : 'desktop'

	return (
		<StyledText as={as} size={textSizes[platform][size]}>
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
