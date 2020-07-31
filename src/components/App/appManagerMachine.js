import {
	CHANGE_CLASS,
	CHANGE_CONSTRAINT_VIEW,
	CHANGE_MINE,
	SET_API_TOKEN,
	TOGGLE_CATEGORY_VISIBILITY,
	TOGGLE_VIEW_IS_LOADING,
	UPDATE_TEMPLATE_QUERIES,
} from 'src/eventConstants'
import { fetchClasses, fetchInstances, fetchLists } from 'src/fetchSummary'
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

/**
 *
 */
const forwardToTemplateView = forwardTo('templateView')

/**
 *
 */
const toggleViewIsLoading = assign({
	// @ts-ignore
	viewIsLoading: (_, { isLoading }) => isLoading,
})

/**
 *
 */
const updateTemplateQueries = assign({
	// @ts-ignore
	possibleQueries: (_, { templatesForSelectedCategories }) => templatesForSelectedCategories,
	// @ts-ignore
	categories: (_, { categories }) => categories,
	// @ts-ignore
	templates: (_, { templates }) => templates,
	// @ts-ignore
	templatesForClassView: (_, { templatesForClassView }) => templatesForClassView,
	// @ts-ignore
	templatesByCategory: (_, { templatesByCategory }) => templatesByCategory,
	// @ts-ignore
	templatesForSelectedCategories: (_, { templatesForSelectedCategories }) =>
		templatesForSelectedCategories,
})

/**
 *
 */
const setTemplateView = assign({
	appView: () => 'templateView',
})

/**
 *
 */
const clearPossibleQueries = assign({
	possibleQueries: () => [],
})

/**
 *
 */
const setPossibleOverviewQueries = assign({
	possibleQueries: () => defaultQueries,
})

/**
 *
 */
const setDefaultView = assign({
	appView: () => 'defaultView',
})

/**
 *
 */
const changeMine = assign({
	// @ts-ignore
	selectedMine: (ctx, { newMine }) => ctx.intermines.find((mine) => mine.name === newMine),
	// Reset the class
	classView: () => 'Gene',
})

/**
 *
 */
const changeClass = assign({
	// @ts-ignore
	classView: (_, { newClass }) => newClass,
})

/**
 *
 */
const setMineConfiguration = assign({
	// @ts-ignore
	intermines: (_, { data }) => data.intermines,
	// @ts-ignore
	modelClasses: (_, { data }) =>
		data.modelClasses.sort().map((cl) => ({ displayName: cl.displayName, name: cl.name })),
	// @ts-ignore
	lists: (_, { data }) => data.lists,
})

/**
 *
 */
const filterListsForClass = assign({
	listsForCurrentClass: (ctx) => {
		/**
		 * Lists are a class instance, and can't be cloned when building the search index
		 * in a service worker. So we have to extract the values we need, namely just the name
		 * and description
		 */
		// return ctx.lists.filter((list) => list.type === ctx.classView)
		return ctx.lists.flatMap((list) => {
			if (list.type !== ctx.classView) {
				return []
			}

			return [
				{
					listName: list.name,
					displayName: list.name.replace(/_/g, ' ').replace(/:/g, ': '),
					description: list.description,
				},
			]
		})
	},
})

/**
 *
 */
const setApiToken = assign({
	// @ts-ignore
	selectedMine: (ctx, { apiToken }) => {
		localStorage.setItem(`apiToken-${ctx.selectedMine.rootUrl}`, apiToken)

		return {
			...ctx.selectedMine,
			apiToken,
		}
	},
})

/**
 *
 */
const getApiTokenFromStorage = assign({
	selectedMine: (ctx) => {
		const apiToken = localStorage.getItem(`apiToken-${ctx.selectedMine.rootUrl}`) ?? ''

		return {
			...ctx.selectedMine,
			apiToken,
		}
	},
})

export const appManagerMachine = Machine(
	{
		id: 'App Manager',
		initial: 'rehydrateApp',
		context: {
			appView: 'defaultView',
			classView: 'Gene',
			intermines: [],
			modelClasses: [],
			lists: [],
			listsForCurrentClass: [],
			listConstraint: {
				path: 'Gene',
				op: 'IN',
				values: [],
			},
			showAllLabel: 'Show All',
			possibleQueries: defaultQueries,
			viewIsLoading: false,
			selectedMine: {
				apiToken: '',
				name: isProduction ? 'HumanMine' : 'biotestmine',
				rootUrl: isProduction
					? 'https://www.humanmine.org/humanmine'
					: 'http://localhost:9999/biotestmine',
			},
			// We have to keep the template context here because it is an invoked machine and when it exits,
			// the state it was called in, it clears its context. Therefore we have to pass the previous
			// context to the template machine to rehydrate it.
			templates: Object.create(null),
			templatesForClassView: [],
			templatesByCategory: [],
			templatesForSelectedCategories: [],
			categories: Object.create(null),
		},
		on: {
			[CHANGE_MINE]: { target: 'loading', actions: ['changeMine', 'getApiTokenFromStorage'] },
			[CHANGE_CLASS]: { actions: ['changeClass'] },
			[UPDATE_TEMPLATE_QUERIES]: { actions: 'updateTemplateQueries' },
			[TOGGLE_VIEW_IS_LOADING]: { actions: 'toggleViewIsLoading' },
			[TOGGLE_CATEGORY_VISIBILITY]: { actions: 'forwardToTemplateView' },
			[SET_API_TOKEN]: { actions: 'setApiToken' },
			[CHANGE_CONSTRAINT_VIEW]: [
				{ target: 'defaultView', cond: 'isDefaultView' },
				{ target: 'templateView', cond: 'isTemplateView' },
				{ target: 'invalidAppView' },
			],
		},
		states: {
			rehydrateApp: {
				always: [{ target: 'loading', actions: 'getApiTokenFromStorage' }],
			},
			loading: {
				on: {
					[CHANGE_CLASS]: { actions: 'changeClass' },
				},
				invoke: {
					id: 'fetchMineConfig',
					src: 'fetchMineConfiguration',
					onDone: {
						target: 'defaultView',
						actions: ['setMineConfiguration', 'filterListsForClass'],
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
						templates: (ctx) => ctx.templates,
						templatesForClassView: (ctx) => ctx.templatesForClassView,
						templatesByCategory: (ctx) => ctx.templatesByCategory,
						templatesForSelectedCategories: (ctx) => ctx.templatesForSelectedCategories,
						categories: (ctx) => ctx.categories,
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
			filterListsForClass,
			setApiToken,
			getApiTokenFromStorage,
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
			fetchMineConfiguration: async (ctx) => {
				let instances
				let modelClasses
				let lists

				if (ctx.intermines.length === 0) {
					const [instancesResult, classesResult, listsResult] = await Promise.all([
						fetchInstances(),
						fetchClasses(ctx.selectedMine.rootUrl),
						fetchLists(ctx.selectedMine.rootUrl),
					])

					instances = instancesResult
					modelClasses = classesResult
					lists = listsResult
				} else {
					const [classesResult, listsResult] = await Promise.all([
						fetchClasses(ctx.selectedMine.rootUrl),
						fetchLists(ctx.selectedMine.rootUrl),
					])

					modelClasses = classesResult
					lists = listsResult
				}

				return {
					modelClasses: Object.entries(modelClasses.classes).map(([_key, value]) => value),
					lists,
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
