import {
	ADD_LIST_TO_TEMPLATE,
	ADD_TEMPLATE_CONSTRAINT,
	FETCH_TEMPLATE_SUMMARY,
	REHYDRATE_LIST_TO_TEMPLATE,
	REMOVE_LIST_FROM_TEMPLATE,
	RESET_TEMPLATE_VIEW,
	UPDATE_TEMPLATE_PLOTS,
} from 'src/eventConstants'
import { sendToBus } from 'src/useEventBus'
import { assign, Machine, spawn } from 'xstate'

import { listConstraintQuery } from '../common'
import { TemplateConstraintMachine } from './TemplateConstraintMachine'

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

		return updatedQuery
	},
})

/**
 *
 */
const setActiveQuery = assign({
	// @ts-ignore
	isActiveQuery: (ctx, { query }) => query?.name === ctx.template.name,
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

			const constraintActor = TemplateConstraintMachine.withContext({
				...TemplateConstraintMachine.context,
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
const resetTemplate = assign((ctx) => {
	return {
		template: ctx.baseTemplate,
		isActiveQuery: false,
	}
})

/**
 *
 */
const resetTemplateSummary = ({ classView, rootUrl }) => {
	sendToBus({
		classView,
		rootUrl,
		type: UPDATE_TEMPLATE_PLOTS,
	})
}

/**
 *
 */
export const templateQueryMachine = Machine(
	{
		id: 'Template Query',
		initial: 'idle',
		context: {
			template: {},
			baseTemplate: {},
			isActiveQuery: false,
			listConstraint: listConstraintQuery,
			rootUrl: '',
			classView: '',
			constraints: [],
			constraintActors: [],
		},
		states: {
			idle: {
				entry: 'spawnConstraintActors',
				on: {
					[ADD_TEMPLATE_CONSTRAINT]: { actions: 'setQueries', cond: 'templateHasQuery' },
					[FETCH_TEMPLATE_SUMMARY]: { actions: 'setActiveQuery' },
					[ADD_LIST_TO_TEMPLATE]: { actions: 'addListConstraint' },
					[REHYDRATE_LIST_TO_TEMPLATE]: { actions: 'addListConstraint' },
					[REMOVE_LIST_FROM_TEMPLATE]: { actions: 'removeListConstraint' },
					[RESET_TEMPLATE_VIEW]: {
						actions: ['resetTemplate', 'spawnConstraintActors', 'resetTemplateSummary'],
					},
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
			resetTemplateSummary,
			resetTemplate,
		},
		guards: {
			// @ts-ignore
			templateHasQuery,
		},
	}
)
