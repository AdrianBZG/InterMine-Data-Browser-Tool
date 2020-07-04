import { Button, Classes } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import React from 'react'

export const CloseButton = () => (
	<div
		css={{
			display: 'flex',
			width: '100%',
			justifyContent: 'flex-end',
		}}
	>
		<Button
			aria-label="Dismiss"
			icon={IconNames.DELETE}
			className={Classes.POPOVER_DISMISS}
			css={{
				borderRadius: 30,
				minWidth: 26,
				minHeight: 26,
				position: 'relative',
				right: -10,
			}}
			intent="danger"
		/>
	</div>
)
