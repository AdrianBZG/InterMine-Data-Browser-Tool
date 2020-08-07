import {
	ADD_LIST_CONSTRAINT,
	ADD_TEMPLATE_CONSTRAINT,
	FETCH_SUMMARY,
	REMOVE_LIST_CONSTRAINT,
	TEMPLATE_CONSTRAINT_UPDATED,
} from 'src/eventConstants'
import { sendToBus } from 'src/useEventBus'
import { assign, Machine, spawn } from 'xstate'

import { listConstraintQuery } from '../common'
import { templateConstraintMachine } from './templateConstraintMachine'

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

const addListConstraint = assign({
	// @ts-ignore
	listConstraint: (ctx, { listName }) => {
		return {
			...ctx.listConstraint,
			path: ctx.classView,
			value: [listName],
		}
	},
})

const removeListConstraint = assign({
	// @ts-ignore
	listConstraint: (ctx) => {
		return {
			...ctx.listConstraint,
			path: ctx.classView,
			value: [],
		}
	},
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
const spawnConstraintActors = assign({
	constraintActors: (ctx) => {
		return ctx.constraints.map((constraint) => {
			const name = constraint.path.split('.').join(' > ')
			const selectedValues = constraint.values ? constraint.values : [constraint.value]

			const constraintActor = templateConstraintMachine.withContext({
				...templateConstraintMachine.context,
				rootUrl: ctx.rootUrl,
				name,
				constraint,
				selectedValues,
				defaultSelections: selectedValues,
			})

			return spawn(constraintActor, `${name}-Template constraint widget`)
		})
	},
})

/**
 *
 */
export const templateQueryMachine = Machine(
	{
		id: 'Template Query',
		initial: 'idle',
		context: {
			template: null,
			isActiveQuery: false,
			listConstraint: listConstraintQuery,
			rootUrl: '',
			constraints: [],
			constraintActors: [],
		},
		states: {
			idle: {
				entry: 'spawnConstraintActors',
				on: {
					[ADD_TEMPLATE_CONSTRAINT]: { actions: 'setQueries', cond: 'templateHasQuery' },
					[FETCH_SUMMARY]: { actions: 'setActiveQuery' },
					[ADD_LIST_CONSTRAINT]: { actions: 'addListConstraint' },
					[REMOVE_LIST_CONSTRAINT]: { actions: 'removeListConstraint' },
				},
			},
		},
	},
	{
		actions: {
			setQueries,
			setActiveQuery,
			addListConstraint,
			removeListConstraint,
			spawnConstraintActors,
		},
		guards: {
			// @ts-ignore
			templateHasQuery,
		},
	}
)
