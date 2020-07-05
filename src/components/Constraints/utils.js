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
