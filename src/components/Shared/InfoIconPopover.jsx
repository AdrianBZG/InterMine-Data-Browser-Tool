import { H4, Icon, Popover, PopoverInteractionKind, Text } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import React from 'react'

export const InfoIconPopover = ({ description, position = 'auto', title }) => (
	<Popover
		interactionKind={PopoverInteractionKind.HOVER_TARGET_ONLY}
		boundary="viewport"
		css={{ marginRight: 20, marginLeft: 5 }}
		usePortal={true}
		lazy={true}
		// @ts-ignore
		position={position}
	>
		<Icon icon={IconNames.INFO_SIGN} color="var(--grey4)" iconSize={20} />
		<div css={{ maxWidth: 500, padding: 20 }}>
			{title && <H4>{title}</H4>}
			<Text>{description ? description : 'No Description Provided'}</Text>
		</div>
	</Popover>
)
