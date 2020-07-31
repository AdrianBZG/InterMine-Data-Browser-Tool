import {
	ADD_LIST_CONSTRAINT,
	APPLY_OVERVIEW_CONSTRAINT_TO_QUERY,
	DELETE_OVERVIEW_CONSTRAINT_FROM_QUERY,
	DELETE_QUERY_CONSTRAINT,
	FETCH_INITIAL_SUMMARY,
	REMOVE_LIST_CONSTRAINT,
	SET_AVAILABLE_COLUMNS,
	UNSET_CONSTRAINT,
} from 'src/eventConstants'
import { sendToBus } from 'src/useMachineBus'
import { assign, Machine } from 'xstate'

import { listConstraintQuery } from '../common'

const initializeMachine = assign({
	currentConstraints: () => [],
	selectedPaths: () => [],
	// @ts-ignore
	classView: (_, { globalConfig }) => globalConfig.classView,
	// @ts-ignore
	rootUrl: (_, { globalConfig }) => globalConfig.rootUrl,
})

const addConstraint = assign({
	// @ts-ignore
	currentConstraints: (ctx, { query }) => {
		const withQueryRemoved = ctx.currentConstraints.filter((c) => {
			return c.path !== query.path
		})

		withQueryRemoved.push(query)

		return withQueryRemoved
	},
})

const removeConstraint = assign({
	// @ts-ignore
	currentConstraints: (ctx, { type, path }) => {
		const prevCount = ctx.currentConstraints.length
		const withoutQuery = ctx.currentConstraints.filter((c) => {
			return c.path !== path
		})

		const nextCount = withoutQuery.length

		// The constraint is being deleted internally, and needs to be synced
		// with the constraint machines
		if (type !== DELETE_OVERVIEW_CONSTRAINT_FROM_QUERY && nextCount !== prevCount) {
			const constraintPath = path.slice(path.indexOf('.') + 1)

			sendToBus({ type: UNSET_CONSTRAINT, path: constraintPath })
		}

		return withoutQuery
	},
})

const setSelectedPaths = assign({
	// @ts-ignore
	selectedPaths: (_, { selectedPaths }) => selectedPaths,
})

const addListConstraint = assign({
	// @ts-ignore
	listConstraint: (ctx, { listName }) => {
		return {
			...ctx.listConstraint,
			path: ctx.classView,
			value: [listName],
		}
	},
})

const removeListConstraint = assign({
	// @ts-ignore
	listConstraint: (ctx) => {
		return {
			...ctx.listConstraint,
			path: ctx.classView,
			value: [],
		}
	},
})

/**
 *
 */
export const queryControllerMachine = Machine(
	{
		id: 'QueryController',
		initial: 'idle',
		context: {
			currentConstraints: [],
			listConstraint: listConstraintQuery,
			classView: '',
			selectedPaths: [],
			rootUrl: '',
		},
		on: {
			[SET_AVAILABLE_COLUMNS]: { actions: 'setSelectedPaths' },
			[DELETE_OVERVIEW_CONSTRAINT_FROM_QUERY]: { target: 'idle', actions: 'removeConstraint' },
			[REMOVE_LIST_CONSTRAINT]: { actions: 'removeListConstraint' },
			[FETCH_INITIAL_SUMMARY]: {
				target: 'idle',
				actions: 'initializeMachine',
				cond: 'isInitialFetch',
			},
		},
		states: {
			idle: {
				on: {
					[ADD_LIST_CONSTRAINT]: [
						{
							target: 'constraintLimitReached',
							cond: {
								type: 'listOccupiesLastSlot',
								// One less than the max since this list will occupy that slot
								maxConstraints: 25,
							},
							actions: 'addListConstraint',
						},
						{
							actions: 'addListConstraint',
						},
					],
					[DELETE_QUERY_CONSTRAINT]: { actions: 'removeConstraint' },
					[APPLY_OVERVIEW_CONSTRAINT_TO_QUERY]: [
						{
							target: 'constraintLimitReached',
							cond: {
								type: 'isLastConstraint',
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
			initializeMachine,
			addConstraint,
			removeConstraint,
			setSelectedPaths,
			addListConstraint,
			removeListConstraint,
		},
		guards: {
			isLastConstraint: (context, _, { cond }) => {
				const maxConstraints =
					// @ts-ignore
					context.listConstraint.value.length === 0 ? cond.maxConstraints : cond.maxConstraints - 1 // subtract the list constraint

				return context.currentConstraints.length + 1 === maxConstraints
			},
			listOccupiesLastSlot: (context, _, { cond }) => {
				// @ts-ignore
				return context.currentConstraints.length + 1 === cond.maxConstraints
			},
			// @ts-ignore
			isInitialFetch: (ctx, { globalConfig }) => {
				return ctx.classView !== globalConfig.classView || ctx.rootUrl !== globalConfig.rootUrl
			},
		},
	}
)
