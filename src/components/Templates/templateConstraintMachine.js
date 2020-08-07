import hash from 'object-hash'
import { fetchPathValues } from 'src/apiRequests'
import { constraintValuesCache } from 'src/caches'
import { fetchableConstraintOps } from 'src/constraintOperations'
import {
	ADD_CONSTRAINT,
	ADD_TEMPLATE_CONSTRAINT,
	FETCH_TEMPLATE_CONSTRAINT_ITEMS,
	REMOVE_CONSTRAINT,
	RESET_OVERVIEW_CONSTRAINT,
	TEMPLATE_CONSTRAINT_UPDATED,
} from 'src/eventConstants'
import { sendToBus } from 'src/useEventBus'
import { assign, Machine } from 'xstate'

import { logErrorToConsole } from '../../utils'

const addValueToConstraint = assign({
	// @ts-ignore
	selectedValues: (ctx, { constraint: value }) => {
		return ctx.constraint.op === 'ONE OF'
			? [...ctx.selectedValues.filter((val) => val !== value), value]
			: [value]
	},
})

const removeValueFromConstraint = assign({
	// @ts-ignore
	selectedValues: (ctx, { constraint: value }) =>
		ctx.selectedValues.filter((selectedValue) => selectedValue !== value),
})

const setAvailableValues = assign({
	// @ts-ignore
	availableValues: (_, { data }) => data.values,
})

const resetConstraint = assign({
	selectedValues: (ctx) => ctx.defaultSelections,
})

const updateTemplateQuery = (ctx) => {
	sendToBus({
		type: ADD_TEMPLATE_CONSTRAINT,
		path: ctx.constraint.path,
		selectedValues: ctx.selectedValues,
	})
}

export const templateConstraintMachine = Machine(
	{
		id: 'Template constraint widget',
		initial: 'idle',
		context: {
			rootUrl: '',
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
			noValuesForConstraint: {},
			idle: {
				always: [{ target: 'noValuesSelected', cond: 'noValuesSelected' }],
				on: {
					[FETCH_TEMPLATE_CONSTRAINT_ITEMS]: { target: 'loading' },
					[ADD_CONSTRAINT]: { target: 'updateTemplateQuery', actions: 'addValueToConstraint' },
					[REMOVE_CONSTRAINT]: {
						target: 'updateTemplateQuery',
						actions: 'removeValueFromConstraint',
					},
					[RESET_OVERVIEW_CONSTRAINT]: {
						target: 'updateTemplateQuery',
						actions: 'resetConstraint',
					},
				},
			},
			noValuesSelected: {
				on: {
					[ADD_CONSTRAINT]: { target: 'updateTemplateQuery', actions: 'addValueToConstraint' },
					[RESET_OVERVIEW_CONSTRAINT]: {
						target: 'updateTemplateQuery',
						actions: 'resetConstraint',
					},
				},
			},
			updateTemplateQuery: {
				entry: 'updateTemplateQuery',
				on: {
					[TEMPLATE_CONSTRAINT_UPDATED]: { target: 'idle', cond: 'constraintUpdated' },
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
