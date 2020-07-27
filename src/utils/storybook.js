import { Card } from '@blueprintjs/core'
import React from 'react'

export const popupDecorator = [
	(storyFn) => <Card css={{ maxWidth: 'fit-content', paddingTop: 8 }}>{storyFn()}</Card>,
]

export const constraintButtonDecorator = [
	(storyFn) => (
		<div css={{ maxWidth: 200, border: '1px solid var(--grey2)', borderRadius: 3, marginTop: 20 }}>
			{storyFn()}
		</div>
	),
]

const { Machine } = require('xstate')

export const machineStub = (initialState = 'noConstraintsSet', available = [], selected = []) =>
	Machine({
		id: 'mockmachine',
		initial: initialState,
		context: {
			selectedValues: selected,
			availableValues: available,
		},
		states: {
			noConstraintsSet: {},
			constraintsUpdated: {},
			constraintsApplied: {},
			constraintsLimitReached: {},
		},
	})
