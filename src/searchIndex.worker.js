/* eslint-disable no-restricted-globals */
import FlexSearch from 'flexsearch'

import { searchIndexCache } from './caches'

self.onmessage = async (event) => {
	const { values, indexConfig, exportConfig, callbackId, cacheKey, indexName } = event.data

	const exportedDocs = {}

	for (const val of values) {
		exportedDocs[val[indexConfig.doc.id]] = val
	}

	const cachedIndex = await searchIndexCache.getItem(cacheKey)
	if (!cachedIndex) {
		// @ts-ignore
		const index = new FlexSearch(indexConfig)

		// @ts-ignore
		index.add(values)

		await searchIndexCache.setItem(cacheKey, {
			// @ts-ignore
			index: index.export(exportConfig),
			name: indexName,
			date: Date.now(),
		})
	}

	// @ts-ignore
	self.postMessage({
		callbackId,
		exportedDocs,
	})
}
