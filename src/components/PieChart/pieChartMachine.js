import { FETCH_INITIAL_SUMMARY, FETCH_UPDATED_SUMMARY } from 'src/eventConstants'
import { fetchSummary } from 'src/fetchSummary'
import { assign, Machine } from 'xstate'

const setSummaryResults = assign({
	// @ts-ignore
	allClassOrganisms: (_, { data }) => data.summary,
	// @ts-ignore
	classView: (_, { data }) => data.classView,
	// @ts-ignore
	rootUrl: (_, { data }) => data.rootUrl,
})

export const PieChartMachine = Machine(
	{
		id: 'PieChart',
		initial: 'hasNoSummary',
		context: {
			allClassOrganisms: [],
			classView: '',
			rootUrl: '',
		},
		on: {
			// Making it global ensure we update the table when the mine/class changes
			[FETCH_INITIAL_SUMMARY]: { target: 'loading', cond: 'isInitialFetch' },
			[FETCH_UPDATED_SUMMARY]: { target: 'loading' },
		},
		states: {
			idle: {},
			loading: {
				invoke: {
					id: 'fetchPieChartValues',
					src: 'fetchItems',
					onDone: {
						target: 'pending',
						actions: 'setSummaryResults',
					},
					onError: {
						target: 'idle',
						actions: (ctx, event) => console.error('FETCH: Pie Chart', { ctx, event }),
					},
				},
			},
			hasNoSummary: {},
			// delay the finished transition to avoid quick flashes of animations
			pending: {
				after: {
					500: [{ target: 'idle', cond: 'hasSummary' }, { target: 'hasNoSummary' }],
				},
			},
		},
	},
	{
		actions: {
			setSummaryResults,
		},
		guards: {
			hasSummary: (ctx) => ctx.allClassOrganisms.length > 0,
			// @ts-ignore
			isInitialFetch: (ctx, { globalConfig }) =>
				ctx.allClassOrganisms.length === 0 ||
				ctx.classView !== globalConfig.classView ||
				ctx.rootUrl !== globalConfig.rootUrl,
		},
		services: {
			fetchItems: async (_ctx, event) => {
				const {
					globalConfig: { classView, rootUrl },
					query: nextQuery,
				} = event

				let query = {
					...nextQuery,
					from: classView,
					select: ['primaryIdentifier'],
					model: {
						name: 'genomic',
					},
				}

				const summary = await fetchSummary({ rootUrl, query, path: 'organism.shortName' })

				return {
					classView,
					rootUrl,
					summary: summary.results,
				}
			},
		},
	}
)
