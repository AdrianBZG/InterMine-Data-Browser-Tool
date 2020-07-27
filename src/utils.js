export const noop = () => {}

export const formatConstraintPath = ({ classView, path }) => `${classView}.${path}`

export const pluralizeFilteredCount = (filteredItems, query) => {
	const isPlural = filteredItems.length > 1 ? 's' : ''

	return query === ''
		? `Showing ${filteredItems.length} Item${isPlural}`
		: `Found ${filteredItems.length} item${isPlural} matching "${query}"`
}

export const getTagCategories = (tags) => {
	const categories = []

	for (let i = 0; i < tags.length; i++) {
		if (tags[i].indexOf('im:aspect') > -1) {
			categories.push(tags[i].replace('im:aspect:', ''))
		}
	}

	return categories.length > 0 ? categories : ['Misc']
}
