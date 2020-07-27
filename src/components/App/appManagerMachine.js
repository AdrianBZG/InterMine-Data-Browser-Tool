import { assign } from '@xstate/immer'
import {
	CHANGE_CLASS,
	CHANGE_CONSTRAINT_VIEW,
	CHANGE_MINE,
	TOGGLE_CATEGORY_VISIBILITY,
	TOGGLE_VIEW_IS_LOADING,
	UPDATE_TEMPLATE_QUERIES,
} from 'src/eventConstants'
import { fetchClasses, fetchInstances } from 'src/fetchSummary'
import { forwardTo, Machine } from 'xstate'

import { templateViewMachine } from './templateViewMachine'

// Todo: Change this after fixing biotestmine dev environment
const isProduction = true

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

export const appManagerMachine = Machine(
	{
		id: 'AppManager',
		initial: 'loading',
		context: {
			appView: 'defaultView',
			classView: 'Gene',
			intermines: [],
			modelClasses: [],
			showAllLabel: 'Show All',
			possibleQueries: defaultQueries,
			categories: {},
			viewIsLoading: false,
			selectedMine: {
				name: isProduction ? 'HumanMine' : 'biotestmine',
				rootUrl: isProduction
					? 'https://www.humanmine.org/humanmine'
					: 'http://localhost:9999/biotestmine',
			},
		},
		on: {
			[CHANGE_MINE]: { target: 'loading', actions: 'changeMine' },
			[CHANGE_CLASS]: { actions: ['changeClass'] },
			[UPDATE_TEMPLATE_QUERIES]: { actions: 'updateTemplateQueries' },
			[TOGGLE_VIEW_IS_LOADING]: { actions: 'toggleViewIsLoading' },
			[TOGGLE_CATEGORY_VISIBILITY]: { actions: 'forwardToTemplateView' },
			[CHANGE_CONSTRAINT_VIEW]: [
				{ target: 'defaultView', cond: 'isDefaultView' },
				{ target: 'templateView', cond: 'isTemplateView' },
				{ target: 'invalidAppView' },
			],
		},
		states: {
			loading: {
				on: {
					[CHANGE_CLASS]: { actions: 'changeClass' },
				},
				invoke: {
					id: 'fetchMines',
					src: 'fetchMinesAndClasses',
					onDone: {
						target: 'defaultView',
						actions: 'setIntermines',
					},
					onError: {
						target: 'defaultView',
						actions: (ctx, event) =>
							console.error('FETCH: could not retrieve intermines', { ctx, event }),
					},
				},
			},
			defaultView: {
				entry: ['setBrowserView', 'setPossibleOverviewQueries'],
				on: {
					[CHANGE_CLASS]: { actions: 'changeClass' },
				},
			},
			templateView: {
				entry: ['setTemplateView', 'clearPossibleQueries'],
				on: {
					[CHANGE_CLASS]: { actions: ['changeClass', 'forwardToTemplateView'] },
				},
				invoke: {
					id: 'templateView',
					src: templateViewMachine,
					data: {
						// Hack until xstate v5 introduces shallow merging
						...templateViewMachine.context,
						classView: (ctx) => ctx.classView,
						showAllLabel: (ctx) => ctx.showAllLabel,
						rootUrl: (ctx) => ctx.selectedMine.rootUrl,
					},
				},
			},
			invalidAppView: {},
		},
	},
	{
		actions: {
			forwardToTemplateView: forwardTo('templateView'),
			// @ts-ignore
			toggleViewIsLoading: assign((ctx, { isLoading }) => {
				ctx.viewIsLoading = isLoading
			}),
			// @ts-ignore
			updateTemplateQueries: assign((ctx, { queries, categories }) => {
				ctx.possibleQueries = queries
				ctx.categories = categories
			}),
			setTemplateView: assign((ctx) => {
				ctx.appView = 'templateView'
			}),
			clearPossibleQueries: assign((ctx) => {
				ctx.possibleQueries = []
			}),
			setPossibleOverviewQueries: assign((ctx) => {
				ctx.possibleQueries = defaultQueries
			}),
			setBrowserView: assign((ctx) => {
				ctx.appView = 'defaultView'
			}),
			// @ts-ignore
			changeMine: assign((ctx, { newMine }) => {
				ctx.selectedMine = ctx.intermines.find((mine) => mine.name === newMine)
				// set it back to default
				ctx.classView = 'Gene'
			}),
			// @ts-ignore
			changeClass: assign((ctx, { newClass }) => {
				ctx.classView = newClass
			}),
			// @ts-ignore
			setIntermines: assign((ctx, { data }) => {
				ctx.intermines = data.intermines
				ctx.modelClasses = data.modelClasses
					.sort()
					.map((cl) => ({ displayName: cl.displayName, name: cl.name }))
			}),
		},
		guards: {
			// @ts-ignore
			isDefaultView: (_, { newTabId }) => {
				return newTabId === 'defaultView'
			},
			// @ts-ignore
			isTemplateView: (_, { newTabId }) => {
				return newTabId === 'templateView'
			},
			// @ts-ignore
			showAllCategories: (ctx, { tagName }) => {
				return tagName === ctx.showAllLabel
			},
		},
		services: {
			fetchMinesAndClasses: async (ctx) => {
				let instances
				let modelClasses

				if (ctx.intermines.length === 0) {
					const [instancesResult, classesResult] = await Promise.all([
						fetchInstances(),
						fetchClasses(ctx.selectedMine.rootUrl),
					])

					instances = instancesResult
					modelClasses = classesResult
				} else {
					modelClasses = await fetchClasses(ctx.selectedMine.rootUrl)
				}

				return {
					modelClasses: Object.entries(modelClasses.classes).map(([_key, value]) => value),
					intermines:
						ctx.intermines.length > 0
							? ctx.intermines
							: instances.data.instances.map((mine) => ({
									name: mine.name,
									rootUrl: mine.url,
							  })),
				}
			},
		},
	}
)
