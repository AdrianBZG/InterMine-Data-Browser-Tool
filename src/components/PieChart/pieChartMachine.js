import hash from 'object-hash'
import { fetchSummary, verifyPath } from 'src/apiRequests'
import { pieChartCache } from 'src/caches'
import { CHANGE_CLASS, CHANGE_MINE, FETCH_INITIAL_SUMMARY, FETCH_SUMMARY } from 'src/eventConstants'
import { startActivity } from 'src/utils'
import { assign, Machine } from 'xstate'

const setSummaryResults = assign({
	// @ts-ignore
	allClassOrganisms: (_, { data }) => data.summary,
})

const ORGANISM_PATH = 'organism.shortName'

export const PieChartMachine = Machine(
	{
		id: 'PieChart',
		initial: 'waitingOnMineToLoad',
		context: {
			allClassOrganisms: [],
		},
		on: {
			[CHANGE_MINE]: { target: 'waitingOnMineToLoad' },
		},
		states: {
			idle: {
				always: [{ target: 'hasNoSummary', cond: 'hasNoSummary' }],
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
					id: 'fetchPieChartValues',
					src: 'fetchItems',
					onDone: {
						target: 'idle',
						actions: 'setSummaryResults',
					},
					onError: {
						target: 'hasNoSummary',
						actions: (ctx, event) => console.error('FETCH: Pie Chart', { ctx, event }),
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
			hasNoSummary: {
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
			setSummaryResults,
		},
		activities: {
			isLoading: startActivity,
			displayingNoValues: startActivity,
			displayingNoPaths: startActivity,
		},
		guards: {
			hasNoSummary: (ctx) => ctx.allClassOrganisms.length === 0,
		},
		services: {
			verifyPath: async (_ctx, event) => {
				const { classView, rootUrl, query } = event

				await verifyPath({ rootUrl, classView, path: ORGANISM_PATH })

				return {
					classView,
					rootUrl,
					query,
				}
			},
			fetchItems: async (_ctx, event) => {
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
			},
		},
	}
)
