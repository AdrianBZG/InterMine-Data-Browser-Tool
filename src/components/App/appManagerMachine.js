import { fetchClasses, fetchInstances, fetchLists } from 'src/apiRequests'
import { appCache } from 'src/caches'
import {
	CHANGE_CLASS,
	CHANGE_CONSTRAINT_VIEW,
	CHANGE_MINE,
	SET_API_TOKEN,
	TOGGLE_CATEGORY_VISIBILITY,
	TOGGLE_VIEW_IS_LOADING,
} from 'src/eventConstants'
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
	intermines: (_, { data }) =>
		data.intermines.map((mine) => ({
			name: mine.name,
			rootUrl: mine.url,
		})),
	// @ts-ignore
	modelClasses: (_, { data }) => {
		return Object.entries(data.modelClasses.classes)
			.map(([_key, value]) => ({
				displayName: value.displayName,
				name: value.name,
			}))
			.sort((a, b) => a.name.localeCompare(b.name))
	},
	// @ts-ignore
	lists: (_, { data }) => {
		return data.lists.map(({ name, title, type }) => ({ name, title, type }))
	},
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

// @ts-ignore
const loadAppContext = assign((ctx, { data }) => {
	return {
		...data.appContext,
	}
})

/**
 *
 */
const rehydrateContext = async () => {
	const appContext = await appCache.getItem('appContext')

	return {
		appContext,
	}
}

/**
 * Services
 */

/**
 *
 */
const dehydrateContext = async (ctx) => {
	try {
		await appCache.setItem('appContext', { ...ctx, date: Date.now() })
	} catch (e) {
		throw Error(e)
	}
}

/**
 *
 */
const logErrorToConsole = (ctx, event) => {
	console.error('FETCH: could not retrieve intermines', { ctx, event })
}

export const appManagerMachine = Machine(
	{
		id: 'App Manager',
		initial: 'rehydrateContext',
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
			categories: Object.create(null),
		},
		on: {
			[CHANGE_MINE]: { target: 'loading', actions: ['changeMine', 'getApiTokenFromStorage'] },
			[CHANGE_CLASS]: { actions: ['changeClass'] },
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
			rehydrateContext: {
				invoke: {
					id: 'rehydrateAppContext',
					src: 'rehydrateContext',
					onDone: {
						target: 'defaultView',
						actions: 'loadAppContext',
					},
					onError: {
						target: 'invalidAppView',
						actions: 'logErrorToConsole',
					},
				},
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
						actions: ['setMineConfiguration', 'filterListsForClass', 'dehydrateContext'],
					},
					onError: {
						target: 'defaultView',
						actions: 'logErrorToConsole',
					},
				},
			},
			defaultView: {
				always: [{ target: 'loading', cond: 'hasNoMineConfig' }],
				entry: ['setDefaultView', 'setPossibleOverviewQueries'],
				on: {
					[CHANGE_CLASS]: { actions: 'changeClass' },
				},
			},
			templateView: {
				entry: ['setTemplateView', 'clearPossibleQueries', 'dehydrateContext'],
				on: {
					[CHANGE_CLASS]: { actions: ['changeClass', 'forwardToTemplateView'] },
				},
				invoke: {
					id: 'templateView',
					src: templateViewMachine,
					data: {
						rootUrl: (ctx) => ctx.selectedMine.rootUrl,
						classView: (ctx) => ctx.classView,
						showAllLabel: (ctx) => ctx.showAllLabel,
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
			logErrorToConsole,
			loadAppContext,
			dehydrateContext,
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
			hasNoMineConfig: (ctx) => {
				return ctx.intermines.length === 0
			},
		},
		services: {
			rehydrateContext,
			fetchMineConfiguration: async (ctx) => {
				const [interminesConfig, modelClasses, lists] = await Promise.all([
					fetchInstances(),
					fetchClasses(ctx.selectedMine.rootUrl),
					fetchLists(ctx.selectedMine.rootUrl),
				])

				return {
					modelClasses,
					lists,
					intermines: interminesConfig.data.instances,
				}
			},
		},
	}
)
