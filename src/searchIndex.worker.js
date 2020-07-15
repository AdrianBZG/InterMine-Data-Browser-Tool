/* eslint-disable no-restricted-globals */
import FlexSearch from 'flexsearch'

self.onmessage = (event) => {
	const { values, indexConfig, exportConfig, callbackId } = event.data
	// @ts-ignore
	const index = new FlexSearch(indexConfig)

	// @ts-ignore
	index.add(values)

	// @ts-ignore
	self.postMessage({ callbackId, results: index.export(exportConfig) })
}
