import {
	ADD_LIST_TO_OVERVIEW,
	APPLY_OVERVIEW_CONSTRAINT_TO_QUERY,
	CHANGE_CLASS,
	CHANGE_MINE,
	CONSTRAINT_UPDATED,
	DELETE_OVERVIEW_CONSTRAINT_FROM_QUERY,
	REMOVE_LIST_FROM_OVERVIEW,
	SET_AVAILABLE_COLUMNS,
} from 'src/eventConstants'
import { sendToBus } from 'src/useEventBus'
import { assign, Machine } from 'xstate'

import { listConstraintQuery } from '../common'

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
		if (nextCount !== prevCount) {
			const constraintPath = path.slice(path.indexOf('.') + 1)

			sendToBus({ type: CONSTRAINT_UPDATED, path: constraintPath })
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
const resetPaths = assign({
	selectedPaths: () => [],
})

/**
 *
 */
export const QueryControllerMachine = Machine(
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
			[SET_AVAILABLE_COLUMNS]: { actions: 'setSelectedPaths', cond: 'doesNotHaveSelectedPaths' },
			[DELETE_OVERVIEW_CONSTRAINT_FROM_QUERY]: { target: 'idle', actions: 'removeConstraint' },
			[REMOVE_LIST_FROM_OVERVIEW]: { actions: 'removeListConstraint' },
			[CHANGE_MINE]: { actions: ['removeListConstraint', 'resetPaths'] },
			[CHANGE_CLASS]: { actions: 'removeListConstraint' },
		},
		states: {
			idle: {
				on: {
					[ADD_LIST_TO_OVERVIEW]: [
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
					[DELETE_OVERVIEW_CONSTRAINT_FROM_QUERY]: { actions: 'removeConstraint' },
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
					[DELETE_OVERVIEW_CONSTRAINT_FROM_QUERY]: {
						actions: 'removeConstraint',
					},
				},
			},
		},
	},
	{
		actions: {
			addConstraint,
			removeConstraint,
			setSelectedPaths,
			addListConstraint,
			removeListConstraint,
			resetPaths,
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
			doesNotHaveSelectedPaths: (ctx) => {
				return ctx.selectedPaths.length === 0
			},
		},
	}
)
