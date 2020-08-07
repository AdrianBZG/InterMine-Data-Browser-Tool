import {
	CHANGE_CLASS,
	FETCH_INITIAL_SUMMARY,
	FETCH_OVERVIEW_SUMMARY,
	FETCH_SUMMARY,
} from 'src/eventConstants'
import { sendToBus } from 'src/useEventBus'
import { assign, Machine, spawn } from 'xstate'

import { overviewConstraintMachine } from '../Overview/overviewConstraintMachine'

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
		return ctx.constraints.map(({ type, name, label, path, op, valuesQuery }) => {
			const constraintActor = overviewConstraintMachine.withContext({
				...overviewConstraintMachine.context,
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
const resetLastOverviewQuery = assign({
	lastOverviewQuery: () => {
		return {}
	},
})

/**
 *
 */
const fetchOverviewSummary = (_ctx, { query, rootUrl, classView }) => {
	sendToBus({ type: FETCH_SUMMARY, query, rootUrl, classView })
}

/**
 *
 */
export const overviewMachine = Machine(
	{
		id: 'overview',
		initial: 'idle',
		context: {
			constraints: defaultQueries,
			constraintActors: [],
			classView: '',
			rootUrl: '',
			lastOverviewQuery: {},
		},
		states: {
			idle: {
				entry: 'spawnConstraintActors',
				on: {
					[FETCH_INITIAL_SUMMARY]: { actions: 'assignLastOverviewQuery' },
					[FETCH_OVERVIEW_SUMMARY]: {
						actions: ['assignLastOverviewQuery', 'fetchOverviewSummary'],
					},
					[CHANGE_CLASS]: { actions: 'resetLastOverviewQuery' },
				},
			},
		},
	},
	{
		actions: {
			spawnConstraintActors,
			assignLastOverviewQuery,
			resetLastOverviewQuery,
			// @ts-ignore
			fetchOverviewSummary,
		},
	}
)
