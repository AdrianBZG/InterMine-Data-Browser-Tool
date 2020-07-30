import {
	CHANGE_PAGE,
	FETCH_INITIAL_SUMMARY,
	FETCH_UPDATED_SUMMARY,
	SET_AVAILABLE_COLUMNS,
} from 'src/eventConstants'
import { fetchTable } from 'src/fetchSummary'
import { sendToBus } from 'src/useMachineBus'
import { assign, Machine } from 'xstate'

const bustCache = assign({
	pages: () => new Map(),
})

const setInitialRows = assign({
	// @ts-ignore
	mineUrl: (_, { data }) => data.rootUrl,
	// @ts-ignore
	totalRows: (_, { data }) => data.totalRows,
	// @ts-ignore
	pageNumber: (_, { data }) => 1,
})

const setLastQuery = assign({
	// @ts-ignore
	lastQuery: (_, { data }) => data.query,
})

const refreshCache = assign({
	// @ts-ignore
	pages: (ctx, { data }) => {
		const tableRows = data.summary
		const cache = ctx.pages
		const visibleRows = ctx.visibleRows
		const startPage = data.startPage
		const pages = []

		tableRows.forEach((row, idx) => {
			const currentPage = pages[pages.length - 1]

			if (idx % visibleRows === 0) {
				pages.push([row])
			} else {
				currentPage.push(row)
			}
		})

		pages.forEach((page, idx) => {
			cache.set(idx + startPage, page)
		})

		return cache
	},
})

const updatePageNumber = assign({
	pageNumber: (_, event) => {
		// If the page number is being updated after fetching, the value will be provided in the data prop
		// @ts-ignore
		return event?.data ? event.data.pageNumber : event.pageNumber
	},
})

export const TableChartMachine = Machine(
	{
		id: 'TableChart',
		initial: 'noTableSummary',
		context: {
			totalRows: 0,
			visibleRows: 25,
			cacheFactor: 20,
			pageNumber: 1,
			pages: new Map(),
			lastQuery: {},
			mineUrl: '',
		},
		on: {
			// Making it global ensure we update the table when the mine/class changes
			[FETCH_INITIAL_SUMMARY]: { target: 'fetchInitialRows', actions: 'bustCache' },
			[FETCH_UPDATED_SUMMARY]: { target: 'fetchInitialRows', actions: 'bustCache' },
		},
		states: {
			idle: {
				on: {
					[CHANGE_PAGE]: [
						{ actions: 'updatePageNumber', cond: 'hasPageInCache' },
						{ target: 'fetchNewPages' },
					],
				},
			},
			fetchInitialRows: {
				invoke: {
					id: 'fetchInitialRows',
					src: 'fetchInitialRows',
					onDone: {
						target: 'pending',
						actions: ['setInitialRows', 'refreshCache', 'setLastQuery'],
					},
					onError: {
						actions: (ctx, event) => console.error('FETCH: Loading Table Rows', { ctx, event }),
					},
				},
			},
			fetchNewPages: {
				invoke: {
					id: 'fetchNewPages',
					src: 'fetchNewPages',
					onDone: {
						target: 'pending',
						actions: ['updatePageNumber', 'refreshCache'],
					},
					onError: {
						actions: (ctx, event) =>
							console.error('FETCH: Could not fetch new Table Rows', { ctx, event }),
					},
				},
			},
			noTableSummary: {},
			pending: {
				after: {
					// Delay the rendering in case the table is currently rendering
					500: [{ target: 'idle', cond: 'hasSummary' }, { target: 'noTableSummary' }],
				},
			},
		},
	},
	{
		actions: {
			bustCache,
			setInitialRows,
			setLastQuery,
			refreshCache,
			updatePageNumber,
		},
		guards: {
			hasSummary: (ctx) => {
				return ctx.totalRows > 0
			},
			// @ts-ignore
			hasPageInCache: (ctx, { pageNumber }) => {
				return ctx.pages.has(pageNumber)
			},
		},
		services: {
			fetchInitialRows: async (ctx, { globalConfig, query: maybeQuery }) => {
				const { classView, rootUrl } = globalConfig
				const query = maybeQuery
					? maybeQuery
					: {
							from: classView,
							select: ['*'],
					  }

				const page = {
					start: 0,
					size: ctx.visibleRows * ctx.cacheFactor,
				}

				const { totalRows, summary } = await fetchTable({ rootUrl, query, page })

				const hasSummary = summary.length > 0
				const headers = hasSummary ? summary[0].map((item) => item.column) : []

				sendToBus({ type: SET_AVAILABLE_COLUMNS, selectedPaths: headers })

				return {
					classView,
					rootUrl,
					totalRows,
					query,
					summary: hasSummary ? summary : [[]],
					// pages are **NOT** zero indexed. Page 1 === start 1
					startPage: 1,
				}
			},
			fetchNewPages: async (ctx, { pageNumber }) => {
				const currentPage = ctx.pageNumber
				const isPagingForward = currentPage < pageNumber
				const size = ctx.visibleRows * ctx.cacheFactor

				/**
				 * When paging backwards, we need to start our calculations to properly fetch the cacheFactor
				 *
				 * For e.g
				 * cacheFactor = 20
				 * currentPage = 223
				 * requestedPage = 222
				 *
				 * We need pages 203-222 for a total of 20 pages
				 * 222 - 20 = 202 // wrong
				 * 223 - 20 = 203 // correct
				 */
				const startPage = isPagingForward ? pageNumber : pageNumber + 1 - ctx.cacheFactor
				const startRow = startPage * ctx.visibleRows - ctx.visibleRows

				const page = {
					start: Math.max(0, startRow),
					size,
				}

				const { summary } = await fetchTable({ rootUrl: ctx.mineUrl, query: ctx.lastQuery, page })

				return {
					pageNumber,
					summary,
					startPage,
				}
			},
		},
	}
)
