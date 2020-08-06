import { Button } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import React from 'react'

export const SaveAsListButton = () => {
	return (
		<Button
			outlined={true}
			disabled={true}
			intent="primary"
			icon={IconNames.CLOUD_UPLOAD}
			text="Save As List"
		/>
	)
}
