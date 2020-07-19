import {
	Button,
	ButtonGroup,
	Classes,
	ControlGroup,
	HTMLTable,
	Icon,
	InputGroup,
	MenuItem,
	Position,
	Tooltip,
} from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import { assign } from '@xstate/immer'
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import {
	CHANGE_PAGE,
	FETCH_INITIAL_SUMMARY,
	FETCH_UPDATED_SUMMARY,
	SET_AVAILABLE_COLUMNS,
} from 'src/actionConstants'
import { fetchTable } from 'src/fetchSummary'
import { humanize, titleize } from 'underscore.string'
import { Machine } from 'xstate'

import { sendToBus, TableServiceContext, useMachineBus, useServiceContext } from '../../machineBus'
import { tableLoadingData } from '../loadingData/tableResults'
import { NonIdealStateWarning } from '../Shared/NonIdealStates'

const refreshCache = ({ tableRows, cache, visibleRows, startPage }) => {
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
}

const TableActionButtons = () => {
	const [selectedLanguage, setLanguage] = useState('Python')
	return (
		<div
			css={{
				display: 'flex',
				justifyContent: 'flex-end',
				marginBottom: '40px',
			}}
		>
			{/* 
			Save as list button 
			*/}
			<Button outlined={true} intent="primary" icon={IconNames.CLOUD_UPLOAD} text="Save As List" />
			{/* 
			Code snippet button
			*/}
			<ButtonGroup css={{ margin: '0px 16px' }}>
				<Button
					outlined={true}
					intent="primary"
					icon={IconNames.CODE}
					text={`Generate ${selectedLanguage} code`}
				/>
				<Select
					filterable={false}
					items={['Python', 'Perl', 'Java', 'Ruby', 'Javascript', 'XML']}
					itemRenderer={(lang, { handleClick }) => {
						// @ts-ignore
						return <MenuItem key={lang} text={lang} onClick={handleClick} />
					}}
					onItemSelect={setLanguage}
				>
					<Button outlined={true} intent="primary" icon={IconNames.CARET_DOWN} />
				</Select>
			</ButtonGroup>
			{/* 
			Export button 
			*/}
			<Button intent="primary" outlined={true} icon={IconNames.ARCHIVE} text="Export" />
		</div>
	)
}

const TablePagingButtons = () => {
	const [state, send] = useServiceContext('table')
	const [pageNumber, setPageNumber] = useState(1)

	const { pageNumber: pageInMachine, visibleRows, totalRows } = state.context

	useEffect(() => {
		setPageNumber(pageInMachine)
	}, [pageInMachine])

	useDebounce(
		() => {
			// @ts-ignore Allow empty values so the user can input single digit pages
			if (pageNumber === pageInMachine || pageNumber === '') {
				return
			}

			send({ type: CHANGE_PAGE, pageNumber })
		},
		500,
		[pageNumber]
	)

	const handleOnChange = (e) => {
		const input = e.target.value

		if (isNaN(input)) {
			return
		}

		if (input === '') {
			// @ts-ignore Allow empty values so the user can input single digit pages
			setPageNumber('')
		} else {
			setPageNumber(parseInt(input))
		}
	}

	const isFirstPage = pageNumber * visibleRows === visibleRows
	const totalPages = Math.ceil(totalRows / visibleRows)
	const pageCount = totalPages <= 1 ? `${totalPages} page` : `${totalPages} pages`
	const isLastPage = pageNumber === totalPages

	return (
		<ControlGroup css={{ justifyContent: 'flex-end' }}>
			<span css={{ alignSelf: 'center', paddingRight: 12, fontSize: 'var(--fs-desktopM1)' }}>
				Page
			</span>
			<Tooltip content="Go to 1st Page" position={Position.TOP}>
				<Button
					icon={IconNames.CHEVRON_BACKWARD}
					disabled={isFirstPage}
					onClick={() => setPageNumber(1)}
				/>
			</Tooltip>
			<Tooltip content="Previous Page" position={Position.TOP}>
				<Button
					icon={IconNames.CHEVRON_LEFT}
					disabled={isFirstPage}
					onClick={() => setPageNumber(pageNumber - 1)}
				/>
			</Tooltip>
			<InputGroup
				css={{ maxWidth: '15%' }}
				onChange={handleOnChange}
				value={`${pageNumber}`}
				round={false}
			/>
			<Tooltip content="Next Page" position={Position.TOP}>
				<Button
					icon={IconNames.CHEVRON_RIGHT}
					disabled={isLastPage}
					onClick={() => setPageNumber(pageNumber + 1)}
				/>
			</Tooltip>
			<Tooltip content="Go to last Page" position={Position.TOP}>
				<Button
					icon={IconNames.CHEVRON_FORWARD}
					disabled={isLastPage}
					onClick={() => setPageNumber(totalPages)}
				/>
			</Tooltip>
			<span
				css={{ alignSelf: 'center', paddingLeft: 10, fontSize: 'var(--fs-desktopM1)' }}
			>{`of ${pageCount}`}</span>
		</ControlGroup>
	)
}

const ColumnHeader = ({ columnName, isLoading }) => {
	const name = titleize(humanize(columnName.replace(/\./g, ' ')))
	const words = name.split(' ')
	const className = words.shift()
	const specifier = words.join(' ')

	return (
		<th scope="col" title={`${className} ${specifier}`}>
			<span css={{ display: 'block' }} className={isLoading ? Classes.SKELETON : ''}>
				{className}
			</span>
			{isLoading ? null : <span>{specifier}</span>}
		</th>
	)
}

const Cell = ({ cell, mineUrl, isLoading }) => {
	const cellValue = cell.value
	const skeletonClass = isLoading ? Classes.SKELETON : ''

	return (
		<td
			css={{
				'&& a': {
					fontWeight: 'normal',
					[`& .${Classes.ICON}`]: {
						paddingRight: 5,
					},
				},
			}}
		>
			{cellValue ? (
				<div title={cellValue} className={skeletonClass}>
					<a href={`${mineUrl}${cell.url}`} target="_blank" rel="noopener noreferrer">
						<Icon icon={IconNames.GLOBE_NETWORK} />
						{cellValue}
					</a>
				</div>
			) : (
				<span className={`${Classes.TEXT_DISABLED} ${skeletonClass}`}>No Value</span>
			)}
		</td>
	)
}

export const TableChartMachine = Machine(
	{
		id: 'TableChart',
		initial: 'idle',
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
			bustCache: assign((ctx) => {
				ctx.pages = new Map()
			}),
			// @ts-ignore
			setInitialRows: assign((ctx, { data }) => {
				ctx.mineUrl = data.rootUrl
				ctx.totalRows = data.totalRows
				// reset the page in case this is an updated query
				ctx.pageNumber = 1
			}),
			// @ts-ignore
			setLastQuery: assign((ctx, { data }) => {
				ctx.lastQuery = data.query
			}),
			// @ts-ignore
			refreshCache: assign((ctx, { data }) => {
				ctx.pages = refreshCache({
					tableRows: data.summary,
					cache: ctx.pages,
					visibleRows: ctx.visibleRows,
					startPage: data.startPage,
				})
			}),
			// @ts-ignore
			updatePageNumber: assign((ctx, event) => {
				// If the page number is being updated after fetching, the value will be provided in the data prop
				// @ts-ignore
				const pageNumber = event?.data ? event.data.pageNumber : event.pageNumber
				ctx.pageNumber = pageNumber
			}),
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
			fetchInitialRows: async (ctx, { globalConfig }) => {
				const { classView, rootUrl } = globalConfig
				const query = {
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

export const Table = () => {
	const [state, send] = useMachineBus(TableChartMachine)

	const { pages, mineUrl, totalRows, pageNumber, visibleRows } = state.context
	const isLoading = !state.matches('idle')
	const rows = isLoading
		? tableLoadingData
		: pages.get(pageNumber) ?? [[]] /** ensure a 2D array on 1st render */

	if (state.matches('noTableSummary')) {
		return (
			<NonIdealStateWarning
				title="No Table results available"
				description="The mine/class combination did not return any table data. If you feel this is an error, please contact support"
			/>
		)
	}

	const previousPage = pageNumber - 1
	const previousPageLastRow = previousPage * visibleRows
	const currentPageFirstRow = previousPageLastRow + 1
	const currentPageLastRow = Math.min(
		totalRows,
		currentPageFirstRow + (visibleRows - 1) /** subtract the first row */
	)

	return (
		<TableServiceContext.Provider value={{ state, send }}>
			<TableActionButtons />
			<div css={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
				<span
					// @ts-ignore
					css={{
						fontSize: 'var(--fs-desktopM1)',
						fontWeight: 'var(--fw-regular)',
						marginLeft: 10,
						alignSelf: 'center',
					}}
					className={isLoading ? Classes.SKELETON : ''}
				>
					{`Showing ${currentPageFirstRow} to ${currentPageLastRow} of ${totalRows} rows`}
				</span>
				<TablePagingButtons />
			</div>
			<HTMLTable css={{ width: '100%' }} interactive={true} striped={true}>
				<thead>
					<tr>
						{rows[0].map((r) => {
							return <ColumnHeader isLoading={isLoading} key={r.column} columnName={r.column} />
						})}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, colIdx) => {
						return (
							<tr key={colIdx}>
								{row.map((cell, rowIdx) => (
									<Cell
										key={`${colIdx}-${rowIdx}`}
										cell={cell}
										mineUrl={mineUrl}
										isLoading={isLoading}
									/>
								))}
							</tr>
						)
					})}
				</tbody>
			</HTMLTable>
		</TableServiceContext.Provider>
	)
}
