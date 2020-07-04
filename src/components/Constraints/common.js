import { LOCK_ALL_CONSTRAINTS, RESET_ALL_CONSTRAINTS } from '../../globalActions'
import {
	ADD_CONSTRAINT,
	APPLY_CONSTRAINT,
	REMOVE_CONSTRAINT,
	RESET_LOCAL_CONSTRAINT,
} from './actions'

export const constraintPopupGlobalActions = {
	[LOCK_ALL_CONSTRAINTS]: 'constraintLimitReached',
	[RESET_ALL_CONSTRAINTS]: { target: 'noConstraintsSet', actions: 'removeAll' },
	[RESET_LOCAL_CONSTRAINT]: { target: 'noConstraintsSet', actions: 'removeAll' },
}

export const checkboxPopupStates = {
	noConstraintsSet: {
		on: {
			[ADD_CONSTRAINT]: {
				target: 'constraintsUpdated',
				actions: 'addConstraint',
			},
		},
	},
	constraintsUpdated: {
		always: [{ target: 'noConstraintsSet', cond: 'constraintListIsEmpty' }],
		on: {
			[ADD_CONSTRAINT]: { actions: 'addConstraint' },
			[REMOVE_CONSTRAINT]: { actions: 'removeConstraint' },
			[APPLY_CONSTRAINT]: 'constraintsApplied',
		},
	},
	constraintsApplied: {
		on: {
			[ADD_CONSTRAINT]: {
				target: 'constraintsUpdated',
				actions: 'addConstraint',
			},
			[REMOVE_CONSTRAINT]: {
				target: 'constraintsUpdated',
				actions: 'removeConstraint',
			},
		},
	},
	constraintLimitReached: {
		on: {
			[REMOVE_CONSTRAINT]: { actions: 'removeConstraint' },
		},
	},
}
