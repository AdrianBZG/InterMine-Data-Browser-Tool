import { assign } from '@xstate/immer'
import {
	ADD_CONSTRAINT,
	ADD_TEMPLATE_CONSTRAINT,
	REMOVE_CONSTRAINT,
	TEMPLATE_CONSTRAINT_UPDATED,
} from 'src/eventConstants'
import { fetchPathValues } from 'src/fetchSummary'
import { sendToBus } from 'src/machineBus'
import { Machine } from 'xstate'

export const templateConstraintMachine = Machine(
	{
		id: 'Template constraint',
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
			// @ts-ignore
			logErrorToConsole: (_, event) => console.warn(event.data),
			// @ts-ignore
			addConstraint: assign((ctx, { constraint }) => {
				if (ctx.op === 'ONE OF') {
					ctx.selectedValues.push(constraint)
				} else {
					ctx.selectedValues = [constraint]
				}
			}),
			// @ts-ignore
			removeConstraint: assign((ctx, { constraint }) => {
				ctx.selectedValues = ctx.selectedValues.filter((name) => name !== constraint)
			}),
			// @ts-ignore
			setAvailableValues: assign((ctx, { data }) => {
				const { values } = data
				ctx.availableValues = values.map((val) => ({ ...val, item: val.value }))
			}),
			updateTemplateQuery: (ctx) => {
				sendToBus({
					type: ADD_TEMPLATE_CONSTRAINT,
					path: ctx.path,
					selectedValues: ctx.selectedValues,
				})
			},
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
