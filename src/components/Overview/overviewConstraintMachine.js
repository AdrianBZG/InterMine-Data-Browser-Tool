import {
	ADD_CONSTRAINT,
	APPLY_DATA_BROWSER_CONSTRAINT,
	APPLY_OVERVIEW_CONSTRAINT_TO_QUERY,
	DELETE_OVERVIEW_CONSTRAINT_FROM_QUERY,
	FETCH_INITIAL_SUMMARY,
	LOCK_ALL_CONSTRAINTS,
	REMOVE_CONSTRAINT,
	RESET_ALL_CONSTRAINTS,
	RESET_LOCAL_CONSTRAINT,
	UNSET_CONSTRAINT,
} from 'src/eventConstants'
import { fetchSummary } from 'src/fetchSummary'
import { sendToBus } from 'src/useMachineBus'
import { formatConstraintPath } from 'src/utils'
import { assign, Machine } from 'xstate'

import { logErrorToConsole } from '../../utils'

const addConstraint = assign({
	// @ts-ignore
	selectedValues: (ctx, { constraint }) => [...ctx.selectedValues, constraint],
})

const removeConstraint = assign({
	// @ts-ignore
	selectedValues: (ctx, { constraint }) => ctx.selectedValues.filter((name) => name !== constraint),
})

const removeAll = assign({
	selectedValues: () => [],
})

const setAvailableValues = assign({
	// @ts-ignore
	availableValues: (_, { data }) => {
		return data.items
	},
	// @ts-ignore
	classView: (_, { data }) => {
		return data.classView
	},
	// @ts-ignore
	rootUrl: (_, { data }) => {
		return data.rootUrl
	},
	selectedValues: () => [],
})

const applyOverviewConstraint = (ctx) => {
	const { classView, constraintPath, selectedValues, availableValues, op } = ctx

	const query = {
		op,
		path: formatConstraintPath({ classView, path: constraintPath }),
		values: selectedValues,
		// used to render the constraints as a list
		valuesDescription: selectedValues.map((selected) => {
			return availableValues.find((v) => v.item === selected)
		}),
	}

	sendToBus({ query, type: APPLY_OVERVIEW_CONSTRAINT_TO_QUERY })
}

const resetConstraint = ({ classView, constraintPath }) => {
	// @ts-ignore
	sendToBus({
		type: DELETE_OVERVIEW_CONSTRAINT_FROM_QUERY,
		path: formatConstraintPath({ classView, path: constraintPath }),
	})
}

export const overviewConstraintMachine = (id = 'ConstraintMachine') =>
	Machine(
		{
			id,
			initial: 'noConstraintsSet',
			context: {
				type: '',
				op: '',
				constraintPath: '',
				selectedValues: [],
				availableValues: [],
				classView: '',
				rootUrl: '',
				constraintItemsQuery: {},
			},
			on: {
				[LOCK_ALL_CONSTRAINTS]: 'constraintLimitReached',
				[RESET_ALL_CONSTRAINTS]: { target: 'noConstraintsSet', actions: 'removeAll' },
				[RESET_LOCAL_CONSTRAINT]: { target: 'noConstraintsSet', actions: 'removeAll' },
				[UNSET_CONSTRAINT]: { target: 'constraintsUpdated', cond: 'pathMatches' },
				[FETCH_INITIAL_SUMMARY]: { target: 'loading', cond: 'isInitialFetch' },
			},
			states: {
				loading: {
					invoke: {
						id: 'fetchInitialValues',
						src: 'fetchInitialValues',
						onDone: {
							target: 'noConstraintsSet',
							actions: 'setAvailableValues',
						},
						onError: {
							target: 'noConstraintItems',
							actions: 'logErrorToConsole',
						},
					},
				},
				noConstraintItems: {},
				noConstraintsSet: {
					always: [{ target: 'noConstraintItems', cond: 'hasNoConstraintItems' }],
					entry: 'resetConstraint',
					on: {
						[ADD_CONSTRAINT]: {
							target: 'constraintsUpdated',
							actions: 'addConstraint',
						},
					},
				},
				constraintsUpdated: {
					always: [{ target: 'noConstraintsSet', cond: 'selectedListIsEmpty' }],
					on: {
						[ADD_CONSTRAINT]: { actions: 'addConstraint' },
						[REMOVE_CONSTRAINT]: { actions: 'removeConstraint' },
						[APPLY_DATA_BROWSER_CONSTRAINT]: {
							target: 'constraintsApplied',
							actions: 'applyOverviewConstraint',
						},
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
				logErrorToConsole,
				addConstraint,
				removeConstraint,
				removeAll,
				setAvailableValues,
				applyOverviewConstraint,
				resetConstraint,
			},
			guards: {
				selectedListIsEmpty: (ctx) => {
					return ctx.selectedValues.length === 0
				},
				hasNoConstraintItems: (ctx) => {
					return ctx.availableValues.length === 0
				},
				// @ts-ignore
				pathMatches: (ctx, { path }) => {
					return ctx.constraintPath === path
				},
				// @ts-ignore
				isInitialFetch: (ctx, { globalConfig }) => {
					return ctx.rootUrl !== globalConfig.rootUrl || ctx.classView !== globalConfig.classView
				},
			},
			services: {
				fetchInitialValues: async (ctx, event) => {
					const { constraintItemsQuery, constraintPath } = ctx

					const {
						globalConfig: { rootUrl, classView },
					} = event

					const query = {
						...constraintItemsQuery,
						from: classView,
					}

					const summary = await fetchSummary({ rootUrl, query, path: constraintPath })

					return {
						rootUrl,
						classView,
						items: summary.results,
					}
				},
			},
		}
	)
