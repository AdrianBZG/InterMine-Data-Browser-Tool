import hash from 'object-hash'
import { fetchSummary, verifyPath } from 'src/apiRequests'
import { barChartCache } from 'src/caches'
import { startActivity } from 'src/utils'
import { assign } from 'xstate'

import { PlotMachine } from '../PlotMachine'

const LENGTH_PATH = 'length'

/***********
 * Actions
 **********/
const setSummaryResults = assign({
	// @ts-ignore
	lengthStats: (_, { data }) => data.lengthStats,
	// @ts-ignore
	lengthSummary: (_, { data }) => data.lengthSummary,
	// @ts-ignore
	hasNoSummary: (_, { data }) => data.lengthSummary.length === 0,
})

/**
 *
 */
const resetSummary = assign({
	hasNoSummary: () => false,
})

/***********
 * Guards
 **********/

/**
 * @param {BarChartContext} ctx
 * @returns {boolean}
 */
const hasNoSummary = (ctx) => ctx.hasNoSummary

/*********
 * Services
 ********/

/**
 *
 */
const verifyPathForClass = async (_ctx, event) => {
	const { classView, rootUrl, query } = event

	await verifyPath({ rootUrl, classView, path: LENGTH_PATH })

	return {
		classView,
		rootUrl,
		query,
	}
}

/**
 *
 */
const fetchItems = async (_ctx, event) => {
	const { classView, rootUrl, query: nextQuery } = event.data

	let query = {
		...nextQuery,
		from: classView,
		select: ['length', 'primaryIdentifier'],
		model: {
			name: 'genomic',
		},
		orderBy: [
			{
				path: LENGTH_PATH,
				direction: 'ASC',
			},
		],
	}

	const summaryConfig = { rootUrl, query, path: LENGTH_PATH }
	const configHash = hash(summaryConfig)
	let summary

	const cachedResult = await barChartCache.getItem(configHash)

	if (cachedResult) {
		summary = cachedResult.summary
	} else {
		summary = await fetchSummary(summaryConfig)

		await barChartCache.setItem(configHash, {
			...summaryConfig,
			summary,
			date: Date.now(),
		})
	}

	return {
		lengthStats: summary.stats,
		lengthSummary: summary.results.slice(0, summary.results.length - 1),
	}
}

/**
 *
 */
const config = {
	actions: {
		setSummaryResults,
		resetSummary,
	},
	activities: {
		isLoading: startActivity,
		displayingNoValues: startActivity,
		displayingNoPaths: startActivity,
	},
	guards: {
		hasNoSummary,
	},
	services: {
		verifyPathForClass,
		fetchItems,
	},
}

/**
 * @typedef {Object} LengthStats
 * @prop {number} min
 * @prop {number} max
 * @prop {number} buckets
 * @prop {number} uniqueValues
 * @prop {number} average
 * @prop {number} stdev
 */

/**
 * @typedef {Object} BarChartContext
 * @prop {any[]} lengthSummary
 * @prop {LengthStats} lengthStats
 * @prop {boolean} hasNoSummary
 */
const context = {
	lengthStats: {
		min: 0,
		max: 0,
		buckets: 0,
		uniqueValues: 0,
		average: 0,
		stdev: 0,
	},
	lengthSummary: [],
}

/**
 * @type {import('xstate').StateNode<BarChartContext, any, import('xstate').AnyEventObject, any>}
 */
// @ts-ignore
export const BarChartMachine = PlotMachine('bar').withConfig(config).withContext(context)
