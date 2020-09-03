import { Classes, Popover, PopoverInteractionKind } from '@blueprintjs/core'
import { ClassNames } from '@emotion/core'
import PropTypes from 'prop-types'
import React from 'react'

import { CloseButton } from './Buttons'

export const PopupCard = ({ children, isOpen, boundary }) => {
	const childrenArray = React.Children.toArray(children)
	const target = childrenArray[0]
	const content = childrenArray.slice(1)

	return (
		<ClassNames>
			{({ css }) => (
				<Popover
					fill={true}
					usePortal={true}
					lazy={true}
					position="right"
					boundary={boundary}
					popoverClassName={`${Classes.POPOVER_CONTENT_SIZING} ${css({
						width: 376,
						[`&& .${Classes.POPOVER_CONTENT}`]: {
							maxWidth: '100%',
							paddingTop: 8,
						},
					})} `}
					interactionKind={PopoverInteractionKind.CLICK}
					isOpen={isOpen}
				>
					{target}
					<div>
						<CloseButton />
						{content}
					</div>
				</Popover>
			)}
		</ClassNames>
	)
}

PopupCard.propTypes = {
	isOpen: PropTypes.oneOf([null, true, false]),
	boundary: PropTypes.string,
}

PopupCard.defaultProps = {
	isOpen: null,
	boundary: 'scrollParent',
}
