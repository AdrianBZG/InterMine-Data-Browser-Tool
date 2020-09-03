import {
	CHANGE_CLASS,
	FETCH_DEFAULT_SUMMARY,
	FETCH_OVERVIEW_SUMMARY,
	RESET_OVERVIEW,
	RESET_PLOTS,
	UPDATE_OVERVIEW_PLOTS,
} from 'src/eventConstants'
import { sendToBus } from 'src/useEventBus'
import { assign, Machine, spawn } from 'xstate'

import { OverviewConstraintMachine } from '../Overview/OverviewConstraintMachine'

/** @type {import('../../types').ConstraintConfig[]} */
const defaultQueries = [
	{
		type: 'checkbox',
		name: 'Organism',
		label: 'Or',
		path: 'organism.shortName',
		op: 'ONE OF',
		valuesQuery: {
			select: ['primaryIdentifier'],
			model: {
				name: 'genomic',
			},
			where: [],
		},
	},
	{
		type: 'select',
		name: 'Pathway Name',
		label: 'Pn',
		path: 'pathways.name',
		op: 'ONE OF',
		valuesQuery: {
			select: ['pathways.name', 'primaryIdentifier'],
			model: {
				name: 'genomic',
			},
			orderBy: [
				{
					path: 'pathways.name',
					direction: 'ASC',
				},
			],
		},
	},
	{
		type: 'select',
		name: 'GO Annotation',
		label: 'GA',
		path: 'goAnnotation.ontologyTerm.name',
		op: 'ONE OF',
		valuesQuery: {
			select: ['goAnnotation.ontologyTerm.name', 'primaryIdentifier'],
			model: {
				name: 'genomic',
			},
			orderBy: [
				{
					path: 'Gene.goAnnotation.ontologyTerm.name',
					direction: 'ASC',
				},
			],
		},
	},
]

/**
 *
 */
const spawnConstraintActors = assign({
	constraintActors: (ctx) => {
		ctx.constraintActors.map((actor) => {
			return actor.stop()
		})

		return ctx.constraints.map(({ type, name, label, path, op, valuesQuery }) => {
			const constraintActor = OverviewConstraintMachine.withContext({
				...OverviewConstraintMachine.context,
				op,
				type,
				label,
				name,
				constraintPath: path,
				constraintItemsQuery: valuesQuery,
				classView: ctx.classView,
				rootUrl: ctx.rootUrl,
			})

			return spawn(constraintActor, `${name} overview constraint machine`)
		})
	},
})

/**
 *
 */
const assignLastOverviewQuery = assign({
	// @ts-ignore
	lastOverviewQuery: (_ctx, { query }) => {
		return query
	},
})

/**
 *
 */
const assigndefaultOverviewQuery = assign({
	// @ts-ignore
	defaultOverviewQuery: (_ctx, { query }) => {
		return query
	},
})

/**
 *
 */
const resetLastOverviewQuery = assign({
	lastOverviewQuery: () => {
		return {}
	},
})

/**
 *
 */
const fetchOverviewSummary = (_ctx, { query, rootUrl, classView }) => {
	sendToBus({ type: RESET_PLOTS })
	sendToBus({ type: FETCH_OVERVIEW_SUMMARY, query, rootUrl, classView })
}

/**
 *
 */
const fetchDefaultSummary = ({ classView, rootUrl, defaultOverviewQuery }) => {
	sendToBus({ type: RESET_PLOTS })
	sendToBus({ type: FETCH_OVERVIEW_SUMMARY, classView, rootUrl, query: defaultOverviewQuery })
}

/**
 *
 */
const resetToInitialQuery = assign({
	lastOverviewQuery: (ctx) => {
		return ctx.defaultOverviewQuery
	},
})

/**
 *
 */
export const OverviewTabMachine = Machine(
	{
		id: 'overview',
		initial: 'idle',
		context: {
			constraints: defaultQueries,
			constraintActors: [],
			classView: '',
			rootUrl: '',
			lastOverviewQuery: {},
			defaultOverviewQuery: {},
		},
		states: {
			idle: {
				entry: 'spawnConstraintActors',
				on: {
					[FETCH_DEFAULT_SUMMARY]: {
						actions: ['assignLastOverviewQuery', 'assigndefaultOverviewQuery'],
					},
					[UPDATE_OVERVIEW_PLOTS]: {
						actions: ['assignLastOverviewQuery', 'fetchOverviewSummary'],
					},
					[CHANGE_CLASS]: { actions: 'resetLastOverviewQuery' },
					[RESET_OVERVIEW]: {
						actions: ['resetToInitialQuery', 'spawnConstraintActors', 'fetchDefaultSummary'],
					},
				},
			},
		},
	},
	{
		actions: {
			spawnConstraintActors,
			assignLastOverviewQuery,
			assigndefaultOverviewQuery,
			resetToInitialQuery,
			resetLastOverviewQuery,
			// @ts-ignore
			fetchOverviewSummary,
			fetchDefaultSummary,
		},
	}
)
