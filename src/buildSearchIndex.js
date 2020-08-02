import FlexSearch from 'flexsearch'
import hash from 'object-hash'

import { searchIndexCache } from './caches'
import { indexWorker } from './searchIndex'

export const buildSearchIndex = async ({ docId, docField, values, query }) => {
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
		doc: false,
		serialize: false,
	}

	// @ts-ignore
	const index = new FlexSearch(indexConfig)

	const cacheKey = hash(query)
	const cachedIndex = await searchIndexCache.getItem(cacheKey)

	if (cachedIndex) {
		const exportedDocs = {}

		for (const val of values) {
			exportedDocs[val[indexConfig.doc.id]] = val
		}
		// @ts-ignore
		index.import(cachedIndex.index, { ...exportConfig, doc: exportedDocs })

		return index
	}

	try {
		if (typeof window !== 'undefined' && window.Worker) {
			const exportedDocs = await indexWorker.index({
				values,
				indexConfig,
				exportConfig,
				cacheKey,
				indexName: query.name,
			})

			const cachedIndex = await searchIndexCache.getItem(cacheKey)
			// @ts-ignore
			index.import(cachedIndex.index, { ...exportConfig, doc: exportedDocs })
		} else {
			// @ts-ignore
			index.add(values)

			searchIndexCache.setItem(cacheKey, {
				// @ts-ignore
				index: index.export(exportConfig),
				name: query.name,
				date: Date.now(),
			})
		}
	} catch (e) {
		console.error(`Error building search indexes: ${e}`)
	}

	return index
}
