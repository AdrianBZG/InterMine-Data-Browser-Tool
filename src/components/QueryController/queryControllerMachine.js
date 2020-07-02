import { assign, Machine } from 'xstate'

import { ADD_CONSTRAINT, DELETE_CONSTRAINT } from '../../actionConstants'

export const queryControllerMachine = Machine(
	{
		id: 'QueryController',
		initial: 'idle',
		context: {
			currentConstraints: [],
		},
		states: {
			idle: {
				on: {
					[DELETE_CONSTRAINT]: {
						actions: 'removeConstraint',
					},
					[ADD_CONSTRAINT]: [
						{
							target: 'constraintLimitReached',
							cond: {
								type: 'canAddConstraint',
								maxConstraints: 26,
							},
							actions: 'addConstraint',
						},
						{
							actions: 'addConstraint',
						},
					],
				},
			},
			constraintLimitReached: {
				on: {
					[DELETE_CONSTRAINT]: {
						actions: 'removeConstraint',
					},
				},
			},
		},
	},
	{
		actions: {
			removeConstraint: assign({
				currentConstraints: (context, event) => {
					// @ts-ignore
					return context.currentConstraints.filter((c) => c !== event.constraint)
				},
			}),
			addConstraint: assign({
				currentConstraints: (context, event) => {
					// @ts-ignore
					context.currentConstraints.push(event.constraint)
					return context.currentConstraints
				},
			}),
		},
		guards: {
			canAddConstraint: (context, _, { cond }) => {
				// @ts-ignore
				return context.currentConstraints.length + 1 === cond.maxConstraints
			},
		},
	}
)
