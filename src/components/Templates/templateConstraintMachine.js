import hash from 'object-hash'
import { fetchPathValues } from 'src/apiRequests'
import { constraintValuesCache } from 'src/caches'
import { fetchableConstraintOps } from 'src/constraintOperations'
import {
	ADD_CONSTRAINT,
	ADD_TEMPLATE_CONSTRAINT,
	FETCH_TEMPLATE_CONSTRAINT_ITEMS,
	REMOVE_CONSTRAINT,
	RESET_TEMPLATE_CONSTRAINT,
} from 'src/eventConstants'
import { assign, Machine, sendParent, sendUpdate } from 'xstate'

import { logErrorToConsole, startActivity } from '../../utils'

/**
 *
 */
const addValueToConstraint = assign({
	// @ts-ignore
	selectedValues: (ctx, { constraint: value }) => {
		return ctx.constraint.op === 'ONE OF'
			? [...ctx.selectedValues.filter((val) => val !== value), value]
			: [value]
	},
})

/**
 *
 */
const removeValueFromConstraint = assign({
	// @ts-ignore
	selectedValues: (ctx, { constraint: value }) =>
		ctx.selectedValues.filter((selectedValue) => selectedValue !== value),
})

/**
 *
 */
const setAvailableValues = assign({
	// @ts-ignore
	availableValues: (_, { data }) => data.values,
})

/**
 *
 */
const resetConstraint = assign({
	selectedValues: (ctx) => ctx.defaultSelections,
})

/**
 *
 */
const updateTemplateQuery = sendParent((ctx) => {
	return {
		type: ADD_TEMPLATE_CONSTRAINT,
		path: ctx.constraint.path,
		selectedValues: ctx.selectedValues,
	}
})

/**
 *
 */
const updateParent = sendUpdate()

/**
 *
 */
export const templateConstraintMachine = Machine(
	{
		id: 'Template constraint widget',
		initial: 'idle',
		context: {
			rootUrl: '',
			name: '',
			constraint: {},
			selectedValues: [],
			defaultSelections: [],
			availableValues: [],
		},
		states: {
			loading: {
				always: [
					{ target: 'idle', cond: 'isNotFetchableConstraint' },
					{ target: 'idle', cond: 'hasValues' },
				],
				invoke: {
					id: 'fetchTemplateConstraintValues',
					src: 'fetchConstraintValues',
					onDone: {
						target: 'idle',
						actions: 'setAvailableValues',
					},
					onError: {
						target: 'noValuesForConstraint',
						actions: 'logErrorToConsole',
					},
				},
			},
			noValuesForConstraint: {
				activities: 'hasNoValues',
			},
			idle: {
				always: [{ target: 'noValuesSelected', cond: 'noValuesSelected', actions: 'updateParent' }],
				on: {
					[FETCH_TEMPLATE_CONSTRAINT_ITEMS]: { target: 'loading' },
					[ADD_CONSTRAINT]: { actions: 'addValueToConstraint' },
					[REMOVE_CONSTRAINT]: {
						actions: 'removeValueFromConstraint',
					},
					[RESET_TEMPLATE_CONSTRAINT]: {
						actions: ['resetConstraint', 'updateParent'],
					},
				},
			},
			noValuesSelected: {
				activities: ['waitingForSelection'],
				on: {
					[ADD_CONSTRAINT]: {
						target: 'idle',
						actions: ['addValueToConstraint', 'updateTemplateQuery'],
					},
					[RESET_TEMPLATE_CONSTRAINT]: {
						target: 'idle',
						actions: ['resetConstraint', 'updateParent'],
					},
				},
			},
		},
	},
	{
		actions: {
			logErrorToConsole,
			addValueToConstraint,
			removeValueFromConstraint,
			setAvailableValues,
			updateTemplateQuery,
			resetConstraint,
			updateParent,
			isLoading: startActivity,
			hasNoValues: startActivity,
		},
		activities: {
			waitingForSelection: startActivity,
		},
		guards: {
			// @ts-ignore
			constraintUpdated: (ctx, { path }) => {
				return ctx.constraint.path === path
			},
			hasValues: (ctx) => {
				return ctx.availableValues.length > 0
			},
			isNotFetchableConstraint: (ctx) => {
				return !fetchableConstraintOps.includes(ctx.constraint.op)
			},
			noValuesSelected: (ctx) => {
				return ctx.selectedValues.length === 0 || ctx.selectedValues[0] === '' // could be an empty string from an Input Widget
			},
		},
		services: {
			fetchConstraintValues: async (ctx) => {
				const valuesConfig = { rootUrl: ctx.rootUrl, path: ctx.constraint.path }
				const configHash = hash(valuesConfig)
				let values

				const cachedResult = await constraintValuesCache.getItem(configHash)

				if (cachedResult) {
					values = cachedResult.values
				} else {
					values = await fetchPathValues(valuesConfig)

					// Todo: Some paths return huge lists, some over 300k values. Setting it to an empty array
					// will default to an input widget After virtualizing the Select widget, we can display the
					// actual values, and allow searching for values.
					if (values.length > 1000) {
						values = []
					}

					await constraintValuesCache.setItem(configHash, {
						...valuesConfig,
						values,
						date: Date.now(),
					})
				}

				return {
					values,
				}
			},
		},
	}
)
