import hash from 'object-hash'
import { fetchSummary, verifyPath } from 'src/apiRequests'
import { barChartCache } from 'src/caches'
import { CHANGE_CLASS, CHANGE_MINE, FETCH_INITIAL_SUMMARY, FETCH_SUMMARY } from 'src/eventConstants'
import { assign, Machine } from 'xstate'

import { startActivity } from '../../utils'

const LENGTH_PATH = 'length'

const setLengthSummary = assign({
	// @ts-ignore
	lengthStats: (_, { data }) => data.lengthStats,
	// @ts-ignore
	lengthSummary: (_, { data }) => data.lengthSummary,
})

/**
 *
 */
const logErrorToConsole = (_, event) => console.warn(event.data)

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
		},
		on: {
			[CHANGE_MINE]: { target: 'waitingOnMineToLoad' },
		},
		states: {
			idle: {
				always: [{ target: 'noGeneLengths', cond: 'hasNoSummary' }],
				on: {
					[FETCH_SUMMARY]: { target: 'verifyPath' },
					[FETCH_INITIAL_SUMMARY]: { target: 'verifyPath' },
				},
			},
			waitingOnMineToLoad: {
				on: {
					[FETCH_INITIAL_SUMMARY]: { target: 'verifyPath' },
				},
				activities: ['isLoading'],
			},
			verifyPath: {
				invoke: {
					id: 'verifyPath',
					src: 'verifyPath',
					onDone: {
						target: 'loading',
					},
					onError: {
						target: 'pathNotAvailable',
					},
				},
			},
			loading: {
				activities: ['isLoading'],
				invoke: {
					id: 'fetchLengths',
					src: 'fetchLengths',
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
			pathNotAvailable: {
				on: {
					[FETCH_SUMMARY]: { target: 'verifyPath' },
					[CHANGE_CLASS]: { target: 'idle' },
					[CHANGE_MINE]: { target: 'waitingOnMineToLoad' },
				},
				activities: ['displayingNoPaths'],
			},
			noGeneLengths: {
				on: {
					[FETCH_SUMMARY]: { target: 'verifyPath' },
					[CHANGE_CLASS]: { target: 'idle' },
					[CHANGE_MINE]: { target: 'waitingOnMineToLoad' },
				},
				activities: ['displayingNoValues'],
			},
		},
	},
	{
		actions: {
			setLengthSummary,
			logErrorToConsole,
		},
		activities: {
			isLoading: startActivity,
			displayingNoValues: startActivity,
			displayingNoPaths: startActivity,
		},
		guards: {
			hasNoSummary: (ctx) => {
				return ctx.lengthSummary.length === 0
			},
		},
		services: {
			verifyPath: async (_ctx, event) => {
				const { classView, rootUrl, query } = event

				await verifyPath({ rootUrl, classView, path: LENGTH_PATH })

				return {
					classView,
					rootUrl,
					query,
				}
			},
			fetchLengths: async (_ctx, event) => {
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
			},
		},
	}
)
