import { assign } from '@xstate/immer'
import { FETCH_INITIAL_SUMMARY, FETCH_UPDATED_SUMMARY } from 'src/eventConstants'
import { fetchSummary } from 'src/fetchSummary'
import { Machine } from 'xstate'

export const PieChartMachine = Machine(
	{
		id: 'PieChart',
		initial: 'hasNoSummary',
		context: {
			allClassOrganisms: [],
			classView: '',
		},
		on: {
			// Making it global ensure we update the table when the mine/class changes
			[FETCH_INITIAL_SUMMARY]: { target: 'loading' },
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
						actions: 'setClassItems',
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
			// @ts-ignore
			setClassItems: assign((ctx, { data }) => {
				ctx.allClassOrganisms = data.summary
				ctx.classView = data.classView
			}),
		},
		guards: {
			hasSummary: (ctx) => ctx.allClassOrganisms.length > 0,
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
					summary: summary.results,
				}
			},
		},
	}
)
