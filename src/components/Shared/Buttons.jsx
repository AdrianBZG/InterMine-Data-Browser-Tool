import { AnchorButton, Button, Classes, PopoverPosition, Tooltip } from '@blueprintjs/core'
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

export const RunQueryButton = ({ isDisabled = false, intent = 'success', handleOnClick }) => {
	return (
		<Tooltip
			css={{ marginTop: 20, display: 'inline-block' }}
			content="You have not added or updated any constraints"
			position={PopoverPosition.RIGHT}
			disabled={!isDisabled}
		>
			<AnchorButton
				text="Run Query"
				// @ts-ignore
				intent={intent}
				disabled={isDisabled}
				rightIcon={IconNames.PLAY}
				onClick={handleOnClick}
			/>
		</Tooltip>
	)
}
