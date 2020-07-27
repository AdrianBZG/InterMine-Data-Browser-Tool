import { assign } from '@xstate/immer'
import {
	ADD_TEMPLATE_CONSTRAINT,
	FETCH_UPDATED_SUMMARY,
	TEMPLATE_CONSTRAINT_UPDATED,
} from 'src/eventConstants'
import { sendToBus } from 'src/machineBus'
import { Machine } from 'xstate'

/**
 *
 */
// @ts-ignore
const setQueries = assign((ctx, { path, selectedValues }) => {
	const query = ctx.template.where.find((con) => con.path === path)
	if ('value' in query) {
		query.value = selectedValues[0]
	} else {
		query.values = selectedValues
	}

	sendToBus({ type: TEMPLATE_CONSTRAINT_UPDATED, path })
})

/**
 *
 */
// @ts-ignore
const setActiveQuery = assign((ctx, { query }) => {
	ctx.isActiveQuery = query.name === ctx.template.name
})

/**
 * @returns {boolean}
 */
const templateHasQuery = (ctx, { path }) => {
	return ctx.template.where.some((con) => con.path === path)
}

/**
 *
 */
export const templateQueryMachine = Machine(
	{
		id: 'Template query machine',
		initial: 'idle',
		context: {
			template: null,
			isActiveQuery: false,
		},
		states: {
			idle: {
				on: {
					[ADD_TEMPLATE_CONSTRAINT]: { actions: 'setQueries', cond: 'templateHasQuery' },
					[FETCH_UPDATED_SUMMARY]: { actions: 'setActiveQuery' },
				},
			},
		},
	},
	{
		actions: {
			setQueries,
			setActiveQuery,
		},
		guards: {
			// @ts-ignore
			templateHasQuery,
		},
	}
)
