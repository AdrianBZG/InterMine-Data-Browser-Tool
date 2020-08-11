import { Classes, NonIdealState } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import React from 'react'

export const NonIdealStateWarning = ({
	title = '',
	description = '',
	className = '',
	isWarning = true,
}) => (
	<NonIdealState
		title={title}
		description={description}
		icon={isWarning ? IconNames.WARNING_SIGN : IconNames.INFO_SIGN}
		className={className}
		css={{
			paddingBottom: 32,
			borderRadius: 3,
			[`& .${Classes.NON_IDEAL_STATE_VISUAL}`]: {
				color: isWarning ? 'var(--yellow5)' : 'var(--blue5)',
			},
		}}
	/>
)
