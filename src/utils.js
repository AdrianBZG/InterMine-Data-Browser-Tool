export const noop = () => {}

export const formatConstraintPath = ({ classView, path }) => `${classView}.${path}`

export const pluralizeFilteredCount = (filteredItems, query) => {
	const isPlural = filteredItems.length > 1 ? 's' : ''

	return query === ''
		? `Showing ${filteredItems.length} Item${isPlural}`
		: `Found ${filteredItems.length} item${isPlural} matching "${query}"`
}
