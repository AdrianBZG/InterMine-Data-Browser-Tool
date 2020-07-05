import { assign } from '@xstate/immer'
import { Machine } from 'xstate'

import { LOCK_ALL_CONSTRAINTS, RESET_ALL_CONSTRAINTS } from '../../globalActions'
import {
	ADD_CONSTRAINT,
	APPLY_CONSTRAINT,
	REMOVE_CONSTRAINT,
	RESET_LOCAL_CONSTRAINT,
} from './actions'

export const constraintMachineFactory = ({ id, initial = 'noConstraintsSet' }) =>
	Machine(
		{
			id,
			initial,
			context: {
				selectedValues: [],
				availableValues: [],
			},
			on: {
				[LOCK_ALL_CONSTRAINTS]: 'constraintLimitReached',
				[RESET_ALL_CONSTRAINTS]: { target: 'noConstraintsSet', actions: 'removeAll' },
				[RESET_LOCAL_CONSTRAINT]: { target: 'noConstraintsSet', actions: 'removeAll' },
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
			},
		},
		{
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
			},
			guards: {
				constraintListIsEmpty: (ctx) => {
					return ctx.selectedValues.length === 0
				},
			},
		}
	)
