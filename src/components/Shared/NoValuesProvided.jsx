import { Icon, NonIdealState } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import React from 'react'

export const NoValuesProvided = ({
	title = 'There are no values for this constraint',
	description = "If you feel this is a mistake, try refreshing the browser. If that doesn't work, let us know",
}) => {
	return (
		<NonIdealState
			title={title}
			description={description}
			icon={<Icon icon={IconNames.WARNING_SIGN} color="var(--yellow5)" iconSize={64} />}
		/>
	)
}
