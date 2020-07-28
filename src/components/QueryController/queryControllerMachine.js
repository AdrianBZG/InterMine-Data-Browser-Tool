import {
	APPLY_OVERVIEW_CONSTRAINT_TO_QUERY,
	DELETE_OVERVIEW_CONSTRAINT_FROM_QUERY,
	DELETE_QUERY_CONSTRAINT,
	FETCH_INITIAL_SUMMARY,
	SET_AVAILABLE_COLUMNS,
	UNSET_CONSTRAINT,
} from 'src/eventConstants'
import { sendToBus } from 'src/machineBus'
import { assign, Machine } from 'xstate'

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

/**
 *
 */
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
			[SET_AVAILABLE_COLUMNS]: { actions: 'setSelectedPaths' },
			[DELETE_OVERVIEW_CONSTRAINT_FROM_QUERY]: { target: 'idle', actions: 'removeConstraint' },
			[FETCH_INITIAL_SUMMARY]: {
				target: 'idle',
				actions: 'initializeMachine',
			},
		},
		states: {
			idle: {
				on: {
					[DELETE_QUERY_CONSTRAINT]: { actions: 'removeConstraint' },
					[APPLY_OVERVIEW_CONSTRAINT_TO_QUERY]: [
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
			initializeMachine,
			addConstraint,
			removeConstraint,
			setSelectedPaths,
		},
		guards: {
			canAddConstraint: (context, _, { cond }) => {
				// @ts-ignore
				return context.currentConstraints.length + 1 === cond.maxConstraints
			},
		},
	}
)
