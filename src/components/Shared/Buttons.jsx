import { Button, Classes } from '@blueprintjs/core'
import React from 'react'

export const CloseButton = () => (
	<div css={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
		<Button text="Dismiss" className={Classes.POPOVER_DISMISS} intent="danger" />
	</div>
)
