import { assign } from '@xstate/immer'
import { sendToBus } from 'src/machineBus'
import { Machine } from 'xstate'

import {
	ADD_CONSTRAINT,
	APPLY_CONSTRAINT,
	APPLY_CONSTRAINT_TO_QUERY,
	LOCK_ALL_CONSTRAINTS,
	REMOVE_CONSTRAINT,
	RESET_ALL_CONSTRAINTS,
	RESET_LOCAL_CONSTRAINT,
	UNSET_CONSTRAINT,
} from '../../actionConstants'

/** @type {import('../../types').CreateConstraintMachine} */
export const createConstraintMachine = ({ id, initial = 'noConstraintsSet', path = '', op }) => {
	/** @type {import('../../types').ConstraintMachineConfig} */
	const config = {
		id,
		initial,
		context: {
			constraintPath: path,
			selectedValues: [],
			availableValues: [
				// fixme: remove this mock
				{ item: 'one species', count: 0 },
				{ item: 'two chemics', count: 0 },
			],
		},
		on: {
			[LOCK_ALL_CONSTRAINTS]: 'constraintLimitReached',
			[RESET_ALL_CONSTRAINTS]: { target: 'noConstraintsSet', actions: 'removeAll' },
			[RESET_LOCAL_CONSTRAINT]: { target: 'noConstraintsSet', actions: 'removeAll' },
			[UNSET_CONSTRAINT]: { target: 'constraintsUpdated', cond: 'pathMatches' },
		},
		states: {
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
					[APPLY_CONSTRAINT]: { target: 'constraintsApplied', actions: 'applyConstraint' },
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
		},
	}

	return Machine(config, {
		actions: {
			// @ts-ignore
			addConstraint: assign((ctx, { constraint }) => {
				ctx.selectedValues.push(constraint)
			}),
			// @ts-ignore
			removeConstraint: assign((ctx, { constraint }) => {
				ctx.selectedValues = ctx.selectedValues.filter((name) => name !== constraint)
			}),
			removeAll: assign((ctx) => {
				ctx.selectedValues = []
			}),
			setAvailableValues: assign((ctx, event) => {
				// @ts-ignore
				ctx.availableValues = event.values
			}),
			applyConstraint: (ctx) => {
				const query = {
					path,
					op,
					values: ctx.selectedValues,
					itemDescription: ctx.selectedValues.map((selected) => {
						return ctx.availableValues.find((v) => v.item === selected)
					}),
				}

				sendToBus({ query, to: '*', type: APPLY_CONSTRAINT_TO_QUERY })
			},
		},
		guards: {
			constraintListIsEmpty: (ctx) => {
				return ctx.selectedValues.length === 0
			},
			// @ts-ignore
			pathMatches: (ctx, { path }) => {
				return ctx.constraintPath === path
			},
		},
	})
}
