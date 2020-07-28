import {
	CHANGE_CLASS,
	CHANGE_CONSTRAINT_VIEW,
	CHANGE_MINE,
	TOGGLE_CATEGORY_VISIBILITY,
	TOGGLE_VIEW_IS_LOADING,
	UPDATE_TEMPLATE_QUERIES,
} from 'src/eventConstants'
import { fetchClasses, fetchInstances } from 'src/fetchSummary'
import { assign, forwardTo, Machine } from 'xstate'

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

const forwardToTemplateView = forwardTo('templateView')

const toggleViewIsLoading = assign({
	// @ts-ignore
	viewIsLoading: (_, { isLoading }) => isLoading,
})

const updateTemplateQueries = assign({
	// @ts-ignore
	possibleQueries: (_, { queries }) => queries,
	// @ts-ignore
	categories: (_, { categories }) => categories,
})

const setTemplateView = assign({
	appView: () => 'templateView',
})

const clearPossibleQueries = assign({
	possibleQueries: () => [],
})

const setPossibleOverviewQueries = assign({
	possibleQueries: () => defaultQueries,
})

const setDefaultView = assign({
	appView: () => 'defaultView',
})

const changeMine = assign({
	// @ts-ignore
	selectedMine: (ctx, { newMine }) => ctx.intermines.find((mine) => mine.name === newMine),
	// Reset the class
	classView: () => 'Gene',
})

const changeClass = assign({
	// @ts-ignore
	classView: (_, { newClass }) => newClass,
})

const setMineConfiguration = assign({
	// @ts-ignore
	intermines: (_, { data }) => data.intermines,
	// @ts-ignore
	modelClasses: (_, { data }) =>
		data.modelClasses.sort().map((cl) => ({ displayName: cl.displayName, name: cl.name })),
})

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
						actions: 'setMineConfiguration',
					},
					onError: {
						target: 'defaultView',
						actions: (ctx, event) =>
							console.error('FETCH: could not retrieve intermines', { ctx, event }),
					},
				},
			},
			defaultView: {
				entry: ['setDefaultView', 'setPossibleOverviewQueries'],
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
			forwardToTemplateView,
			toggleViewIsLoading,
			updateTemplateQueries,
			setTemplateView,
			clearPossibleQueries,
			setPossibleOverviewQueries,
			setDefaultView,
			changeMine,
			changeClass,
			setMineConfiguration,
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
