import hash from 'object-hash'
import { fetchSummary } from 'src/apiRequests'
import { constraintValuesCache } from 'src/caches'
import {
	ADD_CONSTRAINT,
	APPLY_OVERVIEW_CONSTRAINT,
	APPLY_OVERVIEW_CONSTRAINT_TO_QUERY,
	CONSTRAINT_UPDATED,
	DELETE_OVERVIEW_CONSTRAINT_FROM_QUERY,
	LOCK_ALL_CONSTRAINTS,
	REMOVE_CONSTRAINT,
	RESET_ALL_CONSTRAINTS,
	RESET_OVERVIEW_CONSTRAINT,
} from 'src/eventConstants'
import { sendToBus } from 'src/useEventBus'
import { formatConstraintPath, startActivity } from 'src/utils'
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

export const overviewConstraintMachine = Machine(
	{
		id: 'Constraint machine',
		initial: 'loading',
		context: {
			type: '',
			op: '',
			label: '',
			name: '',
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
			[RESET_OVERVIEW_CONSTRAINT]: { target: 'noConstraintsSet', actions: 'removeAll' },
			[CONSTRAINT_UPDATED]: { target: 'constraintsUpdated', cond: 'pathMatches' },
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
				activities: ['isLoading', 'disablingButtons'],
			},
			noConstraintItems: {
				activities: ['hasNoValues', 'disablingButtons'],
			},
			noConstraintsSet: {
				activities: ['disablingButtons'],
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
				activities: ['waitingToApplyContraint'],
				always: [{ target: 'noConstraintsSet', cond: 'selectedListIsEmpty' }],
				on: {
					[ADD_CONSTRAINT]: { actions: 'addConstraint' },
					[REMOVE_CONSTRAINT]: { actions: 'removeConstraint' },
					[APPLY_OVERVIEW_CONSTRAINT]: {
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
		activities: {
			isLoading: startActivity,
			disablingButtons: startActivity,
			waitingToApplyContraint: startActivity,
			hasNoValues: startActivity,
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
		},
		services: {
			fetchInitialValues: async (ctx, event) => {
				const { constraintItemsQuery, constraintPath } = ctx

				const rootUrl = event?.rootUrl ?? ctx.rootUrl
				const classView = event?.classView ?? ctx.classView

				const query = {
					...constraintItemsQuery,
					from: classView,
				}

				const summaryConfig = { rootUrl, query, path: constraintPath }
				const configHash = hash(summaryConfig)
				let summary

				const cachedResult = await constraintValuesCache.getItem(configHash)

				if (cachedResult) {
					summary = cachedResult.summary
				} else {
					summary = (await fetchSummary(summaryConfig)).results

					await constraintValuesCache.setItem(configHash, {
						...summaryConfig,
						summary,
						date: Date.now(),
					})
				}

				return {
					rootUrl,
					classView,
					items: summary,
				}
			},
		},
	}
)
