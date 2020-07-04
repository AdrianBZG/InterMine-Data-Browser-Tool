import { Classes, NonIdealState } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import React from 'react'

export const NonIdealStateWarning = ({ title = '', description = '' }) => (
	<NonIdealState
		title={title}
		description={description}
		icon={IconNames.WARNING_SIGN}
		css={{
			paddingBottom: 32,
			borderRadius: 3,
			[`& .${Classes.NON_IDEAL_STATE_VISUAL}`]: {
				color: 'var(--yellow5)',
			},
		}}
	/>
)
