import localForage from 'localforage'

// 24 hours
const CACHE_EXPIRY_TIME = 1000 * 60 * 60 * 24
const INTERVAL = 1000 * 60

export const purgeExpiredCaches = (cache) => {
	const interval = setInterval(async () => {
		const now = Date.now()

		try {
			await cache.iterate(async (value, key) => {
				if (now - value.date > CACHE_EXPIRY_TIME) {
					await cache.removeItem(key)
				}
			})
		} catch (e) {
			console.error(`Error purging expired cache key. Deleting the database instead`)
			await cache.clear()
		}
	}, INTERVAL)

	return interval
}

export const pieChartCache = localForage.createInstance({
	name: 'pie chart',
	version: 1.0,
})
purgeExpiredCaches(pieChartCache)

export const barChartCache = localForage.createInstance({
	name: 'bar chart',
	version: 1.0,
})
purgeExpiredCaches(barChartCache)

export const tableCache = localForage.createInstance({
	name: 'table',
	version: 1.0,
})
purgeExpiredCaches(tableCache)

export const constraintValuesCache = localForage.createInstance({
	name: 'constraint values',
	version: 1.0,
})
purgeExpiredCaches(constraintValuesCache)

export const templatesCache = localForage.createInstance({
	name: 'templates',
	version: 1.0,
})
purgeExpiredCaches(templatesCache)

export const searchIndexCache = localForage.createInstance({
	name: 'search indexes',
	version: 1.0,
})
purgeExpiredCaches(searchIndexCache)

export const interminesConfigCache = localForage.createInstance({
	name: 'intermines',
	version: 1.0,
})
purgeExpiredCaches(interminesConfigCache)
