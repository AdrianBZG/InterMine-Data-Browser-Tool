import hash from 'object-hash'
import { fetchSummary } from 'src/apiRequests'
import { barChartCache } from 'src/caches'
import { CHANGE_MINE, FETCH_SUMMARY } from 'src/eventConstants'
import { assign, Machine } from 'xstate'

import { logErrorToConsole } from '../../utils'

const setLengthSummary = assign({
	// @ts-ignore
	lengthStats: (_, { data }) => data.lengthStats,
	// @ts-ignore
	lengthSummary: (_, { data }) => data.lengthSummary,
	// @ts-ignore
	classView: (_, { data }) => data.classView,
	// @ts-ignore
	rootUrl: (_, { data }) => data.rootUrl,
})

export const BarChartMachine = Machine(
	{
		id: 'BarChart',
		initial: 'waitingOnMineToLoad',
		context: {
			lengthStats: {
				min: 0,
				max: 0,
				buckets: 0,
				uniqueValues: 0,
				average: 0,
				stdev: 0,
			},
			lengthSummary: [],
			classView: '',
			rootUrl: '',
		},
		on: {
			[CHANGE_MINE]: { target: 'waitingOnMineToLoad' },
		},
		states: {
			idle: {
				always: [{ target: 'noGeneLengths', cond: 'hasNoSummary' }],
				on: {
					[FETCH_SUMMARY]: { target: 'loading' },
				},
			},
			waitingOnMineToLoad: {
				on: {
					[FETCH_SUMMARY]: { target: 'loading' },
				},
			},
			loading: {
				invoke: {
					id: 'fetchGeneLength',
					src: 'fetchGeneLength',
					onDone: {
						target: 'idle',
						actions: 'setLengthSummary',
					},
					onError: {
						target: 'noGeneLengths',
						actions: 'logErrorToConsole',
					},
				},
			},
			noGeneLengths: {
				on: {
					[FETCH_SUMMARY]: { target: 'loading' },
				},
			},
		},
	},
	{
		actions: {
			setLengthSummary,
			logErrorToConsole,
		},
		guards: {
			hasNoSummary: (ctx) => {
				return ctx.lengthSummary.length === 0
			},
		},
		services: {
			fetchGeneLength: async (_ctx, { classView, rootUrl, query: nextQuery }) => {
				let query = {
					...nextQuery,
					from: classView,
					select: ['length', 'primaryIdentifier'],
					model: {
						name: 'genomic',
					},
					orderBy: [
						{
							path: 'length',
							direction: 'ASC',
						},
					],
				}

				const summaryConfig = { rootUrl, query, path: 'length' }
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
					classView,
					rootUrl,
					lengthStats: summary.stats,
					lengthSummary: summary.results.slice(0, summary.results.length - 1),
				}
			},
		},
	}
)
