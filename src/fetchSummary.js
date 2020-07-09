import imjs from 'imjs'

import { formatConstraintPath } from './utils'

export const fetchSummary = async ({ rootUrl, query, path }) => {
	const service = new imjs.Service({ root: rootUrl })
	const q = new imjs.Query(query, service)

	const fullPath = formatConstraintPath({ classView: query.from, path })

	return await q.summarize(fullPath)
}

export const fetchTable = async ({ rootUrl, query, page }) => {
	const service = new imjs.Service({ root: rootUrl })

	return await service.tableRows(query, page)
}
