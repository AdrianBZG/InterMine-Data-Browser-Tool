import FlexSearch from 'flexsearch'
import localForage from 'localforage'

import { indexWorker } from './searchIndex'

const searchStore = localForage.createInstance({
	name: 'search Indexes',
})

export const buildSearchIndex = async ({ docId, docField, values, cacheKey }) => {
	// The configuration *must* be the same for import and export
	const indexConfig = {
		encode: 'advanced',
		tokenize: 'reverse',
		suggest: true,
		cache: true,
		doc: {
			id: docId,
			field: docField,
		},
	}

	const exportConfig = {
		index: true,
		doc: true,
	}

	// @ts-ignore
	const index = new FlexSearch(indexConfig)

	try {
		const cachedIndex = await searchStore.getItem(cacheKey)

		if (cachedIndex) {
			// @ts-ignore
			index.import(cachedIndex, exportConfig)
		} else if (typeof window !== 'undefined' && window.Worker) {
			const serializedIndex = await indexWorker.index({
				values,
				indexConfig,
				exportConfig,
			})

			searchStore.setItem(cacheKey, serializedIndex)
			// @ts-ignore
			index.import(serializedIndex, exportConfig)
		} else {
			// @ts-ignore
			index.add(values)
		}
	} catch (e) {
		console.error(`Error building search indexes: ${e}`)
	}

	return index
}
