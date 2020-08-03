import localForage from 'localforage'

export const appCache = localForage.createInstance({
	name: 'app',
})

export const pieChartCache = localForage.createInstance({
	name: 'pie chart',
})

export const barChartCache = localForage.createInstance({
	name: 'bar chart',
})

export const tableCache = localForage.createInstance({
	name: 'table',
})

export const constraintValuesCache = localForage.createInstance({
	name: 'constraint values',
})

export const templatesCache = localForage.createInstance({
	name: 'templates',
})

export const searchIndexCache = localForage.createInstance({
	name: 'search indexes',
})

export const interminesConfigCache = localForage.createInstance({
	name: 'intermines',
})
