import { assign } from '@xstate/immer'
import { Machine } from 'xstate'

import { ADD_QUERY_CONSTRAINT, DELETE_QUERY_CONSTRAINT } from '../../actionConstants'

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
					[DELETE_QUERY_CONSTRAINT]: {
						actions: 'removeConstraint',
					},
					[ADD_QUERY_CONSTRAINT]: [
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
					[DELETE_QUERY_CONSTRAINT]: {
						actions: 'removeConstraint',
					},
				},
			},
		},
	},
	{
		actions: {
			addConstraint: assign((ctx, event) => {
				// @ts-ignore
				ctx.currentConstraints.push(event.constraint)
				return ctx
			}),
			removeConstraint: assign((ctx, event) => {
				// @ts-ignore
				ctx.currentConstraints = ctx.currentConstraints.filter((c) => c !== event.constraint)
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
