import {
	Button,
	ButtonGroup,
	Classes,
	ControlGroup,
	Dialog,
	FormGroup,
	HTMLTable,
	Icon,
	InputGroup,
	MenuItem,
	Position,
	Tooltip,
} from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import { useMachine } from '@xstate/react'
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
// use direct import because babel is not properly changing it in webpack
import { useFirstMountState } from 'react-use/lib/useFirstMountState'
import { exportTable } from 'src/apiRequests'
import { CHANGE_PAGE } from 'src/eventConstants'
import { TableServiceContext, useEventBus, useServiceContext } from 'src/useEventBus'
import { tableLoadingData } from 'src/utils/loadingData/tableResults'
import { humanize, titleize } from 'underscore.string'

import { NonIdealStateWarning } from '../Shared/NonIdealStates'
import { TableChartMachine } from './tableMachine'

/**
 *
 */
const ExportTableButton = ({ query, rootUrl }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [format, setFormat] = useState('tsv')
	const [fileName, setFileName] = useState('table data result')
	const [, setErrorDownloading] = useState(false)

	const handleOnClose = () => setIsOpen(false)

	const handleExport = async () => {
		try {
			await exportTable({ query, rootUrl, format, fileName })
		} catch (e) {
			// Todo: display an error message
			setErrorDownloading(true)
			console.error(`Error downloading file: ${e}`)
		}
	}

	return (
		<>
			<Button
				intent="primary"
				outlined={true}
				icon={IconNames.ARCHIVE}
				text="Export"
				onClick={() => setIsOpen(true)}
			/>
			<Dialog
				title="Export Table Data"
				isOpen={isOpen}
				canEscapeKeyClose={true}
				onClose={handleOnClose}
			>
				<div css={{ padding: 40 }}>
					<ControlGroup css={{ display: 'flex' }}>
						<FormGroup label="Filename" labelFor="table-download-filename" labelInfo="(optional)">
							<InputGroup
								id="table-download-filename"
								value={fileName}
								fill={false}
								css={{ width: 160 }}
								onChange={(e) => setFileName(e.target.value)}
							/>
						</FormGroup>
						<Select
							filterable={false}
							items={['tsv', 'csv']}
							itemRenderer={(format, { handleClick }) => {
								// @ts-ignore
								return <MenuItem key={format} text={format} onClick={handleClick} />
							}}
							onItemSelect={setFormat}
							css={{ alignSelf: 'center', marginTop: 8 }}
						>
							<Button intent="none" rightIcon={IconNames.CARET_DOWN} text={format} />
						</Select>
					</ControlGroup>
					<Button
						intent="primary"
						icon={IconNames.ARCHIVE}
						text="Download results"
						onClick={handleExport}
						css={{ marginTop: 10 }}
					/>
				</div>
			</Dialog>
		</>
	)
}

/**
 *
 */
const TableActionButtons = ({ query, rootUrl }) => {
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
			<ExportTableButton query={query} rootUrl={rootUrl} />
		</div>
	)
}

/**
 *
 */
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
			<Tooltip content="Go to 1st Page" position={Position.TOP} disabled={isFirstPage}>
				<Button
					icon={IconNames.CHEVRON_BACKWARD}
					disabled={isFirstPage}
					onClick={() => setPageNumber(1)}
				/>
			</Tooltip>
			<Tooltip content="Previous Page" position={Position.TOP} disabled={isFirstPage}>
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
			<Tooltip content="Next Page" position={Position.TOP} disabled={isLastPage}>
				<Button
					icon={IconNames.CHEVRON_RIGHT}
					disabled={isLastPage}
					onClick={() => setPageNumber(pageNumber + 1)}
				/>
			</Tooltip>
			<Tooltip content="Go to last Page" position={Position.TOP} disabled={isLastPage}>
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

/**
 *
 */
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

/**
 *
 */
const Cell = ({ cell, rootUrl, isLoading }) => {
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
					<a href={`${rootUrl}${cell.url}`} target="_blank" rel="noopener noreferrer">
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

/**
 *
 */
export const Table = React.memo(function Table() {
	const isFirstRender = useFirstMountState()
	const [state, send, service] = useMachine(TableChartMachine)
	useEventBus(service)

	const { pages, rootUrl, totalRows, pageNumber, visibleRows, lastQuery } = state.context
	const isLoading = !state.matches('idle')
	const rows = isLoading
		? tableLoadingData
		: pages.get(pageNumber) ?? [[]] /** ensure a 2D array on 1st render */

	if (state.matches('noTableSummary')) {
		const title = isFirstRender ? 'No query has been executed' : 'No Table results available'
		const description = isFirstRender
			? 'Define the constraints to the left, and execute a query to see visual data results'
			: 'The mine/class combination did not return any table data. If you feel this is an error, please contact support'

		return <NonIdealStateWarning title={title} description={description} />
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
			<TableActionButtons query={lastQuery} rootUrl={rootUrl} />
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
										rootUrl={rootUrl}
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
})
