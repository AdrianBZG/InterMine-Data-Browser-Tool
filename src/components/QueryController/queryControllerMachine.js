import { assign } from '@xstate/immer'
import { APPLY_CONSTRAINT_TO_QUERY, UNSET_CONSTRAINT } from 'src/actionConstants'
import { sendToBus } from 'src/machineBus'
import { Machine } from 'xstate'

import { DELETE_QUERY_CONSTRAINT } from '../../actionConstants'

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
					[DELETE_QUERY_CONSTRAINT]: { actions: 'removeConstraint' },
					[APPLY_CONSTRAINT_TO_QUERY]: [
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
			// @ts-ignore
			addConstraint: assign((ctx, { query }) => {
				ctx.currentConstraints.push(query)
			}),
			// @ts-ignore
			removeConstraint: assign((ctx, { query }) => {
				const prevCount = ctx.currentConstraints.length
				ctx.currentConstraints = ctx.currentConstraints.filter((c) => {
					return c.path !== query.path
				})

				const nextCount = ctx.currentConstraints.length

				if (nextCount !== prevCount) {
					sendToBus({ type: UNSET_CONSTRAINT, path: query.path })
				}
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
