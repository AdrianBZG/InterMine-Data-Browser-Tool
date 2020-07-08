import imjs from 'imjs'

export const fetchSummary = async ({ rootUrl, query, path }) => {
	console.log({ rootUrl, query, path })
	const service = new imjs.Service({ root: rootUrl })
	const q = new imjs.Query(query, service)

	return await q.summarize(`${query.from}.${path}`)
}

export const fetchTable = async ({ rootUrl, query, page }) => {
	const service = new imjs.Service({ root: rootUrl })

	return await service.tableRows(query, page)
}
