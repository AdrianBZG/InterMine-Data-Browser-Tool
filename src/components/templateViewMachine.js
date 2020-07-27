import {
	CHANGE_CLASS,
	TOGGLE_CATEGORY_VISIBILITY,
	TOGGLE_VIEW_IS_LOADING,
} from 'src/actionConstants'
import { fetchTemplates } from 'src/fetchSummary'
import { Machine, sendParent } from 'xstate'

import {
	disableShowAllTag,
	enableShowAllTag,
	filterBySelectedCategory,
	filterTemplatesForClassView,
	resetCategories,
	setCategoriesForClass,
	setTemplates,
	toggleCategory,
	updateClassView,
	updateParent,
} from './templateViewActions'

export const templateViewMachine = Machine(
	{
		id: 'template view',
		context: {
			templates: Object.create(null),
			templatesForClassView: [],
			templatesByCategory: [],
			templatesForSelectedCategories: [],
			categories: Object.create(null),
			classView: '',
			showAllLabel: '',
			rootUrl: '',
		},
		initial: 'loadTemplates',
		states: {
			allCategories: {
				on: {
					[CHANGE_CLASS]: {
						actions: [
							'updateClassView',
							'resetCategories',
							'enableShowAllTag',
							'setCategoriesForClass',
							'filterTemplatesForClassView',
							'filterBySelectedCategory',
							'updateParent',
						],
					},
					[TOGGLE_CATEGORY_VISIBILITY]: [
						{
							cond: 'showAllClicked',
							actions: ['toggleCategory', 'filterBySelectedCategory', 'updateParent'],
						},
						{
							actions: [
								'disableShowAllTag',
								'toggleCategory',
								'filterBySelectedCategory',
								'updateParent',
							],
						},
					],
				},
			},
			noTemplates: {},
			loadTemplates: {
				entry: 'sendIsLoading',
				invoke: {
					id: 'fetchTemplates',
					src: 'fetchTemplates',
					onDone: {
						target: 'allCategories',
						actions: [
							'setTemplates',
							'enableShowAllTag',
							'setCategoriesForClass',
							'filterTemplatesForClassView',
							'filterBySelectedCategory',
							'updateParent',
							'sendIsDoneLoading',
						],
					},
					onError: {
						target: 'noTemplates',
						actions: (ctx, event) =>
							console.error('FETCH: could not fetch templates', { ctx, event }),
					},
				},
			},
		},
	},
	{
		actions: {
			updateParent,
			updateClassView,
			resetCategories,
			sendIsLoading: sendParent({ type: TOGGLE_VIEW_IS_LOADING, isLoading: true }),
			sendIsDoneLoading: sendParent({ type: TOGGLE_VIEW_IS_LOADING, isLoading: false }),
			enableShowAllTag,
			disableShowAllTag,
			setCategoriesForClass,
			filterTemplatesForClassView,
			filterBySelectedCategory,
			toggleCategory,
			setTemplates,
		},
		guards: {
			// @ts-ignore
			showAllClicked: (ctx, { tagName }) => {
				return tagName === ctx.showAllLabel
			},
		},
		services: {
			fetchTemplates: async (ctx) => {
				const templates = await fetchTemplates({ rootUrl: ctx.rootUrl })

				const categories = {
					[ctx.showAllLabel]: {
						tagName: ctx.showAllLabel,
						isVisible: true,
						count: 0,
						classForCategory: 'all',
					},
				}

				return {
					templates,
					categories,
				}
			},
		},
	}
)
