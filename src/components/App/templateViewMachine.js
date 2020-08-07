import hash from 'object-hash'
import { fetchTemplates } from 'src/apiRequests'
import { templatesCache } from 'src/caches'
import { CHANGE_CLASS, TOGGLE_CATEGORY_VISIBILITY } from 'src/eventConstants'
import { getTagCategories } from 'src/utils'
import { assign, Machine } from 'xstate'

/**
 *
 */
const updateClassView = assign({
	// @ts-ignore
	classView: (_, { newClass }) => newClass,
})

/**
 *
 */
const resetCategories = assign({
	categories: (ctx) => {
		// Reset to only the show all tag
		const showAllTag = ctx.categories[ctx.showAllLabel]
		showAllTag.isVisible = true
		showAllTag.count = 0

		return {
			...ctx.categories,
			[ctx.showAllLabel]: showAllTag,
		}
	},
})

/**
 *
 */
const enableShowAllTag = assign({
	categories: (ctx) => {
		const showAllTag = ctx.categories[ctx.showAllLabel]
		showAllTag.isVisible = true

		return {
			...ctx.categories,
			[ctx.showAllLabel]: showAllTag,
		}
	},
})

/**
 *
 */
const disableShowAllTag = assign({
	categories: (ctx) => {
		const showAllTag = ctx.categories[ctx.showAllLabel]
		showAllTag.isVisible = false

		return {
			...ctx.categories,
			[ctx.showAllLabel]: showAllTag,
		}
	},
})

/**
 * Generates the configuration dictionary for the category class
 * that apply to this particular view.
 */
const setCategoriesForClass = assign({
	categoryTagsForClass: (ctx) => {
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

		return Object.keys(categories).map((category) => categories[category])
	},
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

	ctx.templatesForClassView = templatesForClassView.sort((a, b) => a.rank - b.rank)

	ctx.categories[ctx.showAllLabel].count = templatesForClassView.length
})

/**
 * Takes the templates available for a particular class view, and further filters
 * them by any selected category tags.
 */
const filterBySelectedCategory = assign({
	templatesForSelectedCategories: (ctx) => {
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

		return filteredCategories
	},
})

/**
 *
 */
const toggleCategory = assign({
	// @ts-ignore
	categories: (ctx, { isVisible, tagName }) => {
		const updatedTag = ctx.categories[tagName]
		updatedTag.isVisible = isVisible

		return {
			...ctx.categories,
			[tagName]: updatedTag,
		}
	},
})

/**
 *
 */
const setTemplates = assign({
	// @ts-ignore
	templates: (_, { data }) => data.templates,
	// @ts-ignore
	categories: (_, { data }) => data.categories,
})

export const templateViewMachine = Machine(
	{
		id: 'template view',
		context: {
			templates: Object.create(null),
			templatesForClassView: [],
			templatesForSelectedCategories: [],
			categories: Object.create(null),
			categoryTagsForClass: [],
			classView: '',
			showAllLabel: '',
			rootUrl: '',
			mineName: '',
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
						],
					},
					[TOGGLE_CATEGORY_VISIBILITY]: [
						{
							cond: 'showAllClicked',
							actions: ['toggleCategory', 'filterBySelectedCategory'],
						},
						{
							actions: ['disableShowAllTag', 'toggleCategory', 'filterBySelectedCategory'],
						},
					],
				},
			},
			errorFetchingTemplates: {},
			loadTemplates: {
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
			setCategoriesForClass,
			setTemplates,
			toggleCategory,
			updateClassView,
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
						...templatesConfig,
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
