import hash from 'object-hash'
import { fetchSummary, verifyPath } from 'src/apiRequests'
import { pieChartCache } from 'src/caches'
import { startActivity } from 'src/utils'
import { assign } from 'xstate'

import { PlotMachine } from '../PlotMachine'

const ORGANISM_PATH = 'organism.shortName'

/**
 *
 */
const setSummaryResults = assign({
	// @ts-ignore
	allClassOrganisms: (_, { data }) => data.summary,
	// @ts-ignore
	hasNoSummary: (_, { data }) => data.summary.length === 0,
})

/**
 *
 */
const resetSummary = assign({
	hasNoSummary: () => false,
})

/**
 *
 */
const verifyPathForClass = async (_ctx, event) => {
	const { classView, rootUrl, query } = event

	await verifyPath({ rootUrl, classView, path: ORGANISM_PATH })

	return {
		classView,
		rootUrl,
		query,
	}
}

/**
 *
 */
const hasNoSummary = (ctx) => ctx.hasNoSummary

/**
 *
 */
const fetchItems = async (_ctx, event) => {
	const { classView, rootUrl, query: nextQuery } = event.data

	let query = {
		...nextQuery,
		from: classView,
		select: ['primaryIdentifier'],
		model: {
			name: 'genomic',
		},
	}

	const summaryConfig = { rootUrl, query, path: ORGANISM_PATH }
	const configHash = hash(summaryConfig)
	let summary

	const cachedResult = await pieChartCache.getItem(configHash)

	if (cachedResult) {
		summary = cachedResult.summary
	} else {
		summary = await fetchSummary(summaryConfig)

		await pieChartCache.setItem(configHash, {
			...summaryConfig,
			summary,
			date: Date.now(),
		})
	}

	return {
		summary: summary.results,
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
 * @typedef {Object} PieChartContext
 * @prop {{ item: string; count: number; }[]} allClassOrganisms
 * @prop {boolean} hasNoSummary
 */
const context = {
	allClassOrganisms: [],
	hasNoSummary: false,
}

/**
 * @type {import('xstate').StateNode<PieChartContext, any, import('xstate').AnyEventObject, any>}
 */
// @ts-ignore
export const PieChartMachine = PlotMachine('pie').withConfig(config).withContext(context)
