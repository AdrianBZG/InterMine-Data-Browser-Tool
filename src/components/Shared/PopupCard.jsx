import { Classes, Popover, PopoverInteractionKind } from '@blueprintjs/core'
import { ClassNames } from '@emotion/core'
import React from 'react'

export const PopupCard = ({ children }) => {
	return (
		<ClassNames>
			{({ css }) => (
				<Popover
					fill={true}
					usePortal={true}
					lazy={true}
					position="right"
					popoverClassName={`${Classes.POPOVER_CONTENT_SIZING} ${css({
						maxWidth: 500,
						[`&& .${Classes.POPOVER_CONTENT}`]: { maxWidth: 500 },
					})} `}
					interactionKind={PopoverInteractionKind.CLICK}
				>
					{children}
				</Popover>
			)}
		</ClassNames>
	)
}
