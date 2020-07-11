import { assign } from '@xstate/immer'
import {
	APPLY_CONSTRAINT_TO_QUERY,
	DELETE_CONSTRAINT_FROM_QUERY,
	FETCH_INITIAL_SUMMARY,
	SET_AVAILABLE_COLUMNS,
	UNSET_CONSTRAINT,
} from 'src/actionConstants'
import { sendToBus } from 'src/machineBus'
import { Machine } from 'xstate'

import { DELETE_QUERY_CONSTRAINT } from '../../actionConstants'

export const queryControllerMachine = Machine(
	{
		id: 'QueryController',
		initial: 'idle',
		context: {
			currentConstraints: [],
			classView: '',
			selectedPaths: [],
			rootUrl: '',
		},
		on: {
			[SET_AVAILABLE_COLUMNS]: { actions: 'setSelectPaths' },
			[DELETE_CONSTRAINT_FROM_QUERY]: { target: 'idle', actions: 'removeConstraint' },
			[FETCH_INITIAL_SUMMARY]: {
				target: 'idle',
				actions: 'initializeMachine',
			},
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
			initializeMachine: assign((ctx, { globalConfig }) => {
				ctx.classView = globalConfig.classView
				ctx.rootUrl = globalConfig.rootUrl
			}),
			// @ts-ignore
			addConstraint: assign((ctx, { query }) => {
				const withQueryRemoved = ctx.currentConstraints.filter((c) => {
					return c.path !== query.path
				})

				withQueryRemoved.push(query)
				ctx.currentConstraints = withQueryRemoved
			}),
			// @ts-ignore
			removeConstraint: assign((ctx, { type, path }) => {
				const prevCount = ctx.currentConstraints.length
				ctx.currentConstraints = ctx.currentConstraints.filter((c) => {
					return c.path !== path
				})

				const nextCount = ctx.currentConstraints.length

				// The constraint is being deleted internally, and needs to be synced
				// with the constraint machines
				if (type !== DELETE_CONSTRAINT_FROM_QUERY && nextCount !== prevCount) {
					const constraintPath = path.slice(path.indexOf('.') + 1)

					sendToBus({ type: UNSET_CONSTRAINT, path: constraintPath })
				}
			}),
			// @ts-ignore
			setSelectPaths: assign((ctx, { selectedPaths }) => {
				ctx.selectedPaths = selectedPaths
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
