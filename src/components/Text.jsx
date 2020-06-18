import { Text as BText } from '@blueprintjs/core'
import { css, cx } from 'linaria'
import PropTypes from 'prop-types'
import * as React from 'react'

import { useTheme } from '../theme'

export const Text = ({
	isMobile,
	tagName,
	fontSize,
	lineHeight,
	fontWeight,
	children,
	ellipsize,
	className,
}) => {
	const theme = useTheme()

	return (
		<div
			style={{
				'--fontSize': theme.getFontSize(fontSize, isMobile),
				'--lineHeight': theme.fontLineHeights[lineHeight],
				'--fontWeight': theme.fontWeights[fontWeight],
			}}
		>
			<BText
				className={cx(
					className,
					css`
						font-size: var(--fontSize);
						line-height: var(--lineHeight);
						font-weight: var(--fontWeight);
					`
				)}
				ellipsize={ellipsize}
				tagName={tagName}
			>
				{children}
			</BText>
		</div>
	)
}

Text.propTypes = {
	fontSize: PropTypes.oneOf(['s1', 's2', 'm1', 'm2', 'm3', 'l1', 'l2', 'l3']),
	/**
	 * Selects the correct font size for the platform
	 */
	isMobile: PropTypes.bool,
	/**
	 * ***`default`*** is best for multiline text, such as on cards.
	 *
	 * ***`condensed`*** is best for large multiline text.
	 *
	 * ***`condensed-ultra`*** is useful for single lined text since it doesn't add spacing.
	 */
	lineHeight: PropTypes.oneOf(['default', 'condensed', 'condensed-ultra']),
	fontWeight: PropTypes.oneOf(['regular', 'medium', 'semibold', 'bold']),
	/**
	 * Indicates that this component should be truncated with an ellipsis if it overflows its container.
	 * The title attribute will also be added when content overflows to show the full text of the children on hover.
	 *
	 * This is passed to the `Blueprintjs` underlying `Text` component
	 */
	ellipsize: PropTypes.bool,
	/**
	 * HTML tag name to use for rendered element.
	 */
	tagName: PropTypes.string,
}

Text.defaultProps = {
	fontSize: 'm2',
	isMobile: false,
	lineHeight: 'default',
	fontWeight: 'regular',
	ellipsize: false,
	tagName: 'div',
}
