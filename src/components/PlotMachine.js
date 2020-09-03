import {
	FETCH_DEFAULT_SUMMARY,
	FETCH_OVERVIEW_SUMMARY,
	FETCH_TEMPLATE_SUMMARY,
	RESET_PLOTS,
	RESET_PLOTS_TO_DEFAULT,
} from 'src/eventConstants'
import { Machine } from 'xstate'

export const PlotMachine = (name) =>
	Machine({
		id: `${name}-Plot Machine`,
		initial: 'waitForMineToLoad',
		context: {},
		states: {
			waitForQuery: {
				always: [{ target: 'hasNoSummary', cond: 'hasNoSummary' }],
				on: {
					[FETCH_OVERVIEW_SUMMARY]: { target: 'verifyPath' },
					[FETCH_TEMPLATE_SUMMARY]: { target: 'verifyPath' },
					[RESET_PLOTS_TO_DEFAULT]: { target: 'waitForMineToLoad', actions: ['resetSummary'] },
				},
			},
			waitForMineToLoad: {
				activities: ['isLoading'],
				on: {
					[FETCH_DEFAULT_SUMMARY]: { target: 'verifyPath' },
				},
			},
			pathNotAvailable: {
				activities: ['displayingNoPaths'],
				on: {
					[RESET_PLOTS]: { target: 'waitForQuery', actions: ['resetSummary'] },
					[RESET_PLOTS_TO_DEFAULT]: { target: 'waitForMineToLoad', actions: ['resetSummary'] },
				},
			},
			hasNoSummary: {
				activities: ['displayingNoValues'],
				on: {
					[RESET_PLOTS]: { target: 'waitForQuery', actions: ['resetSummary'] },
					[RESET_PLOTS_TO_DEFAULT]: { target: 'waitForMineToLoad', actions: ['resetSummary'] },
				},
			},
			verifyPath: {
				invoke: {
					id: 'verifyPathForClass',
					src: 'verifyPathForClass',
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
						target: 'waitForQuery',
						actions: 'setSummaryResults',
					},
					onError: {
						target: 'hasNoSummary',
						actions: (ctx, event) => console.error('FETCH: Pie Chart', { ctx, event }),
					},
				},
			},
		},
	})
