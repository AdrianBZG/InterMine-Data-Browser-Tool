import hash from 'object-hash'
import { fetchSummary } from 'src/apiRequests'
import { pieChartCache } from 'src/caches'
import { CHANGE_MINE, FETCH_INITIAL_SUMMARY, FETCH_SUMMARY } from 'src/eventConstants'
import { startActivity } from 'src/utils'
import { assign, Machine } from 'xstate'

const setSummaryResults = assign({
	// @ts-ignore
	allClassOrganisms: (_, { data }) => data.summary,
})

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
					[FETCH_SUMMARY]: { target: 'loading' },
					[FETCH_INITIAL_SUMMARY]: { target: 'loading' },
				},
			},
			waitingOnMineToLoad: {
				on: {
					[FETCH_INITIAL_SUMMARY]: { target: 'loading' },
				},
				activities: ['isLoading'],
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
			hasNoSummary: {
				on: {
					[FETCH_SUMMARY]: { target: 'loading' },
				},
				activities: ['hasNoValues'],
			},
		},
	},
	{
		actions: {
			setSummaryResults,
		},
		activities: {
			isLoading: startActivity,
			hasNoValues: startActivity,
		},
		guards: {
			hasNoSummary: (ctx) => ctx.allClassOrganisms.length === 0,
		},
		services: {
			fetchItems: async (_ctx, event) => {
				const { classView, rootUrl, query: nextQuery } = event

				let query = {
					...nextQuery,
					from: classView,
					select: ['primaryIdentifier'],
					model: {
						name: 'genomic',
					},
				}

				const summaryConfig = { rootUrl, query, path: 'organism.shortName' }
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
