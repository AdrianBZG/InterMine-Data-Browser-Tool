import hash from 'object-hash'
import { fetchTemplates } from 'src/apiRequests'
import { templatesCache } from 'src/caches'
import {
	CHANGE_CLASS,
	TOGGLE_CATEGORY_VISIBILITY,
	TOGGLE_VIEW_IS_LOADING,
	UPDATE_TEMPLATE_QUERIES,
} from 'src/eventConstants'
import { getTagCategories } from 'src/utils'
import { assign, Machine, sendParent } from 'xstate'

/**
 * Sends the updated available template queries and category
 * config to the parent machine
 */
const updateParent = sendParent((ctx) => ({
	type: UPDATE_TEMPLATE_QUERIES,
	queries: ctx.templatesForSelectedCategories,
	categories: ctx.categories,
	templates: ctx.templates,
	templatesForClassView: ctx.templatesForClassView,
	templatesByCategory: ctx.templatesByCategory,
	templatesForSelectedCategories: ctx.templatesForSelectedCategories,
}))

/**
 *
 */
// @ts-ignore
const updateClassView = assign((ctx, { newClass }) => {
	ctx.classView = newClass
})

/**
 *
 */
const resetCategories = assign((ctx) => {
	// Reset to only the show all tag
	ctx.categories = {
		[ctx.showAllLabel]: {
			...ctx.categories[ctx.showAllLabel],
			count: 0,
		},
	}
})

/**
 *
 */
const enableShowAllTag = assign((ctx) => {
	ctx.categories[ctx.showAllLabel].isVisible = true
})

/**
 *
 */
const disableShowAllTag = assign((ctx) => {
	ctx.categories[ctx.showAllLabel].isVisible = false
})

/**
 * Generates the configuration dictionary for the category class
 * that apply to this particular view.
 */
const setCategoriesForClass = assign((ctx) => {
	const templates = ctx.templates
	const categories = ctx.categories

	for (const key in templates) {
		const template = templates[key]
		const templateClass = template.select[0].split('.')[0]

		if (templateClass !== ctx.classView) {
			continue
		}

		const tagCategories = getTagCategories(template.tags)

		for (const category of tagCategories) {
			if (!(category in categories)) {
				categories[category] = {
					tagName: category,
					isVisible: false,
					count: 0,
					classForCategory: templateClass,
				}
			}

			categories[category].count += 1
		}
	}
})

/**
 *
 */
const filterTemplatesForClassView = assign((ctx) => {
	const allTemplates = ctx.templates
	const templatesForClassView = []
	const templatesByCategory = {}

	Object.keys(allTemplates).forEach((key) => {
		const template = allTemplates[key]
		if (template.select[0].split('.')[0] === ctx.classView) {
			templatesForClassView.push(template)

			const categories = getTagCategories(template.tags)

			categories.forEach((category) => {
				if (!(category in templatesByCategory)) {
					templatesByCategory[category] = []
				}

				templatesByCategory[category].push(template)
			})
		}
	})

	ctx.templatesForClassView = templatesForClassView
	ctx.categories[ctx.showAllLabel].count = templatesForClassView.length
})

/**
 * Takes the templates available for a particular class view, and further filters
 * them by any selected category tags.
 */
const filterBySelectedCategory = assign((ctx) => {
	const categories = ctx.categories
	const classTemplates = ctx.templatesForClassView

	let filteredCategories

	if (categories[ctx.showAllLabel].isVisible) {
		filteredCategories = classTemplates
	} else {
		filteredCategories = classTemplates.filter((template) => {
			const tagCategories = getTagCategories(template.tags)
			return tagCategories.some((cat) => categories[cat].isVisible)
		})
	}

	ctx.templatesForSelectedCategories = filteredCategories
})

/**
 *
 */
// @ts-ignore
const toggleCategory = assign((ctx, { isVisible, tagName }) => {
	ctx.categories[tagName].isVisible = isVisible
})

/**
 *
 */
// @ts-ignore
const setTemplates = assign((ctx, { data }) => {
	ctx.templates = data.templates
	ctx.categories = data.categories
})

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
			errorFetchingTemplates: {},
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
						target: 'errorFetchingTemplates',
						actions: (ctx, event) =>
							console.error('FETCH: could not fetch templates', { ctx, event }),
					},
				},
			},
		},
	},
	{
		actions: {
			disableShowAllTag,
			enableShowAllTag,
			filterBySelectedCategory,
			filterTemplatesForClassView,
			resetCategories,
			sendIsDoneLoading: sendParent({ type: TOGGLE_VIEW_IS_LOADING, isLoading: false }),
			sendIsLoading: sendParent({ type: TOGGLE_VIEW_IS_LOADING, isLoading: true }),
			setCategoriesForClass,
			setTemplates,
			toggleCategory,
			updateClassView,
			updateParent,
		},
		guards: {
			// @ts-ignore
			showAllClicked: (ctx, { tagName }) => {
				return tagName === ctx.showAllLabel
			},
			// @ts-ignore
			hasTemplates: (ctx) => {
				return Object.keys(ctx.templates).length > 0
			},
		},
		services: {
			fetchTemplates: async (ctx) => {
				const templatesConfig = { rootUrl: ctx.rootUrl }
				const configHash = hash(templatesConfig)
				let templates

				const cachedResult = await templatesCache.getItem(configHash)

				if (cachedResult) {
					templates = cachedResult.templates
				} else {
					templates = await fetchTemplates(templatesConfig)

					await templatesCache.setItem(configHash, {
						templatesConfig,
						templates,
						date: Date.now(),
					})
				}

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
