/* eslint-disable no-restricted-globals */
import FlexSearch from 'flexsearch'

import { searchIndexCache } from './caches'

self.onmessage = async (event) => {
	const { values, indexConfig, exportConfig, callbackId, cacheKey, indexName } = event.data
	// @ts-ignore
	const index = new FlexSearch(indexConfig)

	// @ts-ignore
	index.add(values)

	searchIndexCache.setItem(cacheKey, {
		// @ts-ignore
		index: index.export(exportConfig),
		name: indexName,
		date: Date.now(),
	})

	// @ts-ignore
	// self.postMessage({ callbackId, results: index.export(exportConfig) })
	self.postMessage({ callbackId, hasBeenCached: true })
}
