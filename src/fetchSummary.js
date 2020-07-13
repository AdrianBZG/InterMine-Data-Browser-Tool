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

	const fullPath = formatConstraintPath({ classView: query.from, path })

	return await q.summarize(fullPath)
}

export const fetchTable = async ({ rootUrl, query, page }) => {
	const service = getService(rootUrl)
	return await service.tableRows(query, page)
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
