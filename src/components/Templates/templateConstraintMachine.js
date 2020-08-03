import hash from 'object-hash'
import { fetchPathValues } from 'src/apiRequests'
import { constraintValuesCache } from 'src/caches'
import {
	ADD_CONSTRAINT,
	ADD_TEMPLATE_CONSTRAINT,
	REMOVE_CONSTRAINT,
	TEMPLATE_CONSTRAINT_UPDATED,
} from 'src/eventConstants'
import { sendToBus } from 'src/useMachineBus'
import { assign, Machine, sendUpdate } from 'xstate'

import { logErrorToConsole } from '../../utils'

const addValueToConstraint = assign({
	// @ts-ignore
	selectedValues: (ctx, { constraint: value }) => {
		return ctx.constraint.op === 'ONE OF' ? [...ctx.selectedValues, value] : [value]
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
			availableValues: [],
		},
		states: {
			loading: {
				invoke: {
					id: 'fetchTemplateConstraintValues',
					src: 'fetchConstraintValues',
					onDone: {
						target: 'idle',
						actions: ['setAvailableValues', 'sendUpdate'],
					},
					onError: {
						target: 'noValuesForConstraint',
						actions: 'logErrorToConsole',
					},
				},
			},
			noValuesForConstraint: {},
			idle: {
				on: {
					[ADD_CONSTRAINT]: { target: 'updateTemplateQuery', actions: 'addValueToConstraint' },
					[REMOVE_CONSTRAINT]: {
						target: 'updateTemplateQuery',
						actions: 'removeValueFromConstraint',
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
			sendUpdate,
		},
		guards: {
			// @ts-ignore
			constraintUpdated: (ctx, { path }) => {
				return ctx.constraint.path === path
			},
			hasValues: (ctx) => {
				return ctx.availableValues.length > 0
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
