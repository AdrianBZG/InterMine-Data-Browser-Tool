import axios from 'axios'
import { saveAs } from 'file-saver'
import imjs from 'imjs'
import { humanize, titleize } from 'underscore.string'

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

export const INTERMINE_REGISTRY = 'https://registry.intermine.org/service/instances'

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

export const fetchInstances = async (registry) => {
	return axios.get(registry, {
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

export const fetchLists = async (rootUrl) => {
	const service = getService(rootUrl)

	return await service.fetchLists()
}

export const exportTable = async ({ query, rootUrl, format, fileName, headers }) => {
	const service = getService(rootUrl)
	const q = await service.query(query)

	const file = await service.post('query/results', { format, query: q.toXML() })

	const tableRows = file.split(/\n/)

	const tableHeaders = headers.map((name) => {
		const title = titleize(humanize(name.replace(/\./g, ' ')))
		const words = title.split(' ')

		return words.splice(1).join(' ')
	})

	tableRows.unshift(tableHeaders.join(format === 'csv' ? ',' : '\t'))
	const blob = new Blob([tableRows.join('\n')])

	saveAs(blob, `${fileName}.${format}`)
}
export const fetchCode = async ({ query, fileExtension, rootUrl, codeCache, isSameQuery }) => {
	if (!query || Object.keys(query).length === 0 || (isSameQuery && fileExtension in codeCache)) {
		return
	}

	const service = getService(rootUrl)
	const q = await service.query(query)

	return await q.fetchCode(fileExtension)
}
