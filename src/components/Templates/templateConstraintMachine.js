import { fetchPathValues } from 'src/apiRequests'
import {
	ADD_CONSTRAINT,
	ADD_TEMPLATE_CONSTRAINT,
	REMOVE_CONSTRAINT,
	TEMPLATE_CONSTRAINT_UPDATED,
} from 'src/eventConstants'
import { sendToBus } from 'src/useMachineBus'
import { assign, Machine } from 'xstate'

import { logErrorToConsole } from '../../utils'

const addConstraint = assign({
	// @ts-ignore
	selectedValues: (ctx, { constraint }) => {
		return ctx.op === 'ONE OF' ? [...ctx.selectedValues, constraint] : [constraint]
	},
})

const removeConstraint = assign({
	// @ts-ignore
	selectedValues: (ctx, { constraint }) => ctx.selectedValues.filter((name) => name !== constraint),
})

const setAvailableValues = assign({
	// @ts-ignore
	availableValues: (_, { data }) => data.values,
})

const updateTemplateQuery = (ctx) => {
	sendToBus({
		type: ADD_TEMPLATE_CONSTRAINT,
		path: ctx.path,
		selectedValues: ctx.selectedValues,
	})
}

export const templateConstraintMachine = Machine(
	{
		id: 'Template constraint widget',
		initial: 'loading',
		context: {
			rootUrl: '',
			path: '',
			op: '',
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
				on: {
					[ADD_CONSTRAINT]: { target: 'updateTemplateQuery', actions: 'addConstraint' },
					[REMOVE_CONSTRAINT]: { target: 'updateTemplateQuery', actions: 'removeConstraint' },
				},
			},
			updateTemplateQuery: {
				entry: 'updateTemplateQuery',
				on: {
					[TEMPLATE_CONSTRAINT_UPDATED]: { target: 'idle', cond: 'constraintUpdated' },
				},
			},
			// delay the finished transition to avoid quick flashes of animations
			pending: {
				after: {
					500: [{ target: 'idle', cond: 'hasValues' }, { target: 'noValuesForConstraint' }],
				},
			},
		},
	},
	{
		actions: {
			logErrorToConsole,
			addConstraint,
			removeConstraint,
			setAvailableValues,
			updateTemplateQuery,
		},
		guards: {
			// @ts-ignore
			constraintUpdated: (ctx, { path }) => {
				return ctx.path === path
			},
			hasValues: (ctx) => {
				return ctx.availableValues.length > 0
			},
		},
		services: {
			fetchConstraintValues: async (ctx) => {
				const values = await fetchPathValues({ rootUrl: ctx.rootUrl, path: ctx.path })

				return {
					values,
				}
			},
		},
	}
)
