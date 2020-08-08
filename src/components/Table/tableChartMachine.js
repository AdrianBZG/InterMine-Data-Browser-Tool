import hash from 'object-hash'
import { fetchTable } from 'src/apiRequests'
import { tableCache } from 'src/caches'
import {
	CHANGE_MINE,
	CHANGE_PAGE,
	FETCH_INITIAL_SUMMARY,
	FETCH_SUMMARY,
	SET_AVAILABLE_COLUMNS,
} from 'src/eventConstants'
import { sendToBus } from 'src/useEventBus'
import { startActivity } from 'src/utils'
import { assign, Machine } from 'xstate'

const bustCachedPages = assign({
	pages: () => new Map(),
})

const setInitialRows = assign({
	// @ts-ignore
	rootUrl: (_, { data }) => data.rootUrl,
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
		initial: 'waitingOnMineToLoad',
		context: {
			totalRows: 0,
			visibleRows: 25,
			cacheFactor: 20,
			pageNumber: 1,
			pages: new Map(),
			lastQuery: {},
			rootUrl: '',
		},
		on: {
			[CHANGE_MINE]: { target: 'waitingOnMineToLoad' },
		},
		states: {
			waitingOnMineToLoad: {
				on: {
					[FETCH_INITIAL_SUMMARY]: {
						target: 'fetchInitialRows',
						actions: 'bustCachedPages',
					},
				},
			},
			idle: {
				always: [{ target: 'noTableSummary', cond: 'hasNoTableSummary' }],
				on: {
					[CHANGE_PAGE]: [
						{ actions: 'updatePageNumber', cond: 'hasPageInCache' },
						{ target: 'fetchNewPages' },
					],
					[FETCH_SUMMARY]: { target: 'fetchInitialRows', actions: 'bustCachedPages' },
					[FETCH_INITIAL_SUMMARY]: {
						target: 'fetchInitialRows',
						actions: 'bustCachedPages',
					},
				},
			},
			fetchInitialRows: {
				invoke: {
					id: 'fetchInitialRows',
					src: 'fetchInitialRows',
					onDone: {
						target: 'idle',
						actions: ['setInitialRows', 'refreshCache', 'setLastQuery'],
					},
					onError: {
						target: 'noTableSummary',
						actions: (ctx, event) => console.error('FETCH: Loading Table Rows', { ctx, event }),
					},
				},
				activities: ['isLoading'],
			},
			fetchNewPages: {
				invoke: {
					id: 'fetchNewPages',
					src: 'fetchNewPages',
					onDone: {
						target: 'idle',
						actions: ['updatePageNumber', 'refreshCache'],
					},
					onError: {
						target: 'noTableSummary',
						actions: (ctx, event) =>
							console.error('FETCH: Could not fetch new Table Rows', { ctx, event }),
					},
				},
				activities: ['isLoading'],
			},
			noTableSummary: {
				on: {
					[FETCH_SUMMARY]: {
						target: 'fetchInitialRows',
						actions: 'bustCachedPages',
					},
				},
				activities: ['hasNoValues'],
			},
		},
	},
	{
		actions: {
			bustCachedPages,
			setInitialRows,
			setLastQuery,
			refreshCache,
			updatePageNumber,
		},
		activities: {
			isLoading: startActivity,
			hasNoValues: startActivity,
		},
		guards: {
			hasNoTableSummary: (ctx) => {
				return ctx.totalRows === 0
			},
			// @ts-ignore
			hasPageInCache: (ctx, { pageNumber }) => {
				return ctx.pages.has(pageNumber)
			},
		},
		services: {
			fetchInitialRows: async (ctx, { classView, rootUrl, query: maybeQuery }) => {
				const query =
					maybeQuery && Object.keys(maybeQuery).length > 0
						? maybeQuery
						: {
								from: classView,
								select: ['*'],
						  }

				const page = {
					start: 0,
					size: ctx.visibleRows * ctx.cacheFactor,
				}

				const tableRowsConfig = { rootUrl, query, page }
				const configHash = hash(tableRowsConfig)
				let tableRows

				const cachedResult = await tableCache.getItem(configHash)

				if (cachedResult) {
					tableRows = cachedResult
				} else {
					tableRows = await fetchTable(tableRowsConfig)

					await tableCache.setItem(configHash, {
						...tableRowsConfig,
						...tableRows,
						date: Date.now(),
					})
				}

				const { totalRows, summary } = tableRows
				const hasSummary = summary.length > 0
				const headers = hasSummary ? summary[0].map((item) => item.column) : []

				sendToBus({ type: SET_AVAILABLE_COLUMNS, selectedPaths: headers })

				return {
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

				const tableRowsConfig = { rootUrl: ctx.rootUrl, query: ctx.lastQuery, page }
				const configHash = hash(tableRowsConfig)
				let tableRows

				const cachedResult = await tableCache.getItem(configHash)

				if (cachedResult) {
					tableRows = cachedResult.tableRows
				} else {
					tableRows = await fetchTable(tableRowsConfig)

					await tableCache.setItem(configHash, {
						...tableRowsConfig,
						tableRows: tableRows.summary,
						date: Date.now(),
					})
				}

				const { summary } = tableRows

				return {
					pageNumber,
					summary,
					startPage,
				}
			},
		},
	}
)
