import { UPDATE_TEMPLATE_QUERIES } from 'src/actionConstants'
import { getTagCategories } from 'src/utils'
import { assign, sendParent } from 'xstate'

/**
 * Sends the updated available template queries and category
 * config to the parent machine
 */
export const updateParent = sendParent((ctx) => ({
	type: UPDATE_TEMPLATE_QUERIES,
	queries: ctx.templatesForSelectedCategories,
	categories: ctx.categories,
}))

/**
 *
 */
// @ts-ignore
export const updateClassView = assign((ctx, { newClass }) => {
	ctx.classView = newClass
})

/**
 *
 */
export const resetCategories = assign((ctx) => {
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
export const enableShowAllTag = assign((ctx) => {
	ctx.categories[ctx.showAllLabel].isVisible = true
})

/**
 *
 */
export const disableShowAllTag = assign((ctx) => {
	ctx.categories[ctx.showAllLabel].isVisible = false
})

/**
 * Generates the configuration dictionary for the category class
 * that apply to this particular view.
 */
export const setCategoriesForClass = assign((ctx) => {
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
export const filterTemplatesForClassView = assign((ctx) => {
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
export const filterBySelectedCategory = assign((ctx) => {
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
export const toggleCategory = assign((ctx, { isVisible, tagName }) => {
	ctx.categories[tagName].isVisible = isVisible
})

/**
 *
 */
// @ts-ignore
export const setTemplates = assign((ctx, { data }) => {
	ctx.templates = data.templates
	ctx.categories = data.categories
})
