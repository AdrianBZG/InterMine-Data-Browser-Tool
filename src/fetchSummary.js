import axios from 'axios'
import imjs from 'imjs'

import { formatConstraintPath } from './utils'

const serviceCache = {}

const getService = (rootUrl) => {
	let service = serviceCache[rootUrl]
	if (!service) {
		service = new imjs.Service({ root: rootUrl })
		serviceCache[rootUrl] = service
	}

	return service
}

export const fetchSummary = async ({ rootUrl, query, path }) => {
	const service = getService(rootUrl)
	const q = new imjs.Query(query, service)

	let fullPath
	try {
		fullPath = formatConstraintPath({ classView: query.from, path })

		// make sure the path exists
		await service.makePath(fullPath)
	} catch (e) {
		const err = new Error()
		err.message = `The mine at ${rootUrl} does not contain the path ${fullPath}`

		throw err
	}

	return await q.summarize(fullPath)
}

export const fetchTable = async ({ rootUrl, query, page }) => {
	const service = getService(rootUrl)
	const summary = await service.tableRows(query, page)
	const totalRows = await service.count(query)

	return {
		summary,
		totalRows,
	}
}

export const fetchTemplates = async ({ rootUrl }) => {
	const service = getService(rootUrl)

	return await service.fetchTemplates()
}

export const fetchInstances = async () => {
	return axios.get('https://registry.intermine.org/service/instances', {
		params: {
			mine: 'prod',
		},
	})
}

export const fetchClasses = async (rootUrl) => {
	const service = getService(rootUrl)

	return await service.fetchModel()
}

export const fetchPathValues = async ({ path, rootUrl }) => {
	const service = getService(rootUrl)

	return await service.pathValues(path)
}
