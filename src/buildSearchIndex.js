import FlexSearch from 'flexsearch'

import { indexWorker } from './searchIndex'

export const buildSearchIndex = async ({ docId, docField, values }) => {
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

	if (typeof window !== 'undefined' && window.Worker) {
		const serializedIndex = await indexWorker.index({
			values,
			indexConfig,
			exportConfig,
		})

		// @ts-ignore
		index.import(serializedIndex, exportConfig)
	} else {
		// @ts-ignore
		index.add(values)
	}

	return index
}
