import {
	ADD_TEMPLATE_CONSTRAINT,
	FETCH_UPDATED_SUMMARY,
	TEMPLATE_CONSTRAINT_UPDATED,
} from 'src/eventConstants'
import { sendToBus } from 'src/machineBus'
import { assign, Machine } from 'xstate'

/**
 *
 */
const setQueries = assign({
	// @ts-ignore
	template: (ctx, { path, selectedValues }) => {
		const updatedQuery = { ...ctx.template, where: [...ctx.template.where] }

		const query = updatedQuery.where.find((con) => con.path === path)
		if ('value' in query) {
			query.value = selectedValues[0]
		} else {
			query.values = selectedValues
		}

		sendToBus({ type: TEMPLATE_CONSTRAINT_UPDATED, path })

		return updatedQuery
	},
})

/**
 *
 */
const setActiveQuery = assign({
	// @ts-ignore
	isActiveQuery: (ctx, { query }) => query.name === ctx.template.name,
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
