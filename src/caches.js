import localForage from 'localforage'

export const appCache = localForage.createInstance({
	name: 'app',
	version: 1.0,
})

export const pieChartCache = localForage.createInstance({
	name: 'pie chart',
	version: 1.0,
})

export const barChartCache = localForage.createInstance({
	name: 'bar chart',
	version: 1.0,
})

export const tableCache = localForage.createInstance({
	name: 'table',
	version: 1.0,
})

export const constraintValuesCache = localForage.createInstance({
	name: 'constraint values',
	version: 1.0,
})

export const templatesCache = localForage.createInstance({
	name: 'templates',
	version: 1.0,
})

export const searchIndexCache = localForage.createInstance({
	name: 'search indexes',
	version: 1.0,
})

export const interminesConfigCache = localForage.createInstance({
	name: 'intermines',
	version: 1.0,
})
