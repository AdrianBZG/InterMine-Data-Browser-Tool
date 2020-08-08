import { Classes, HTMLTable, Icon } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { useMachine } from '@xstate/react'
import React from 'react'
// use direct import because babel is not properly changing it in webpack
import { useFirstMountState } from 'react-use/lib/useFirstMountState'
import { TableServiceContext, useEventBus } from 'src/useEventBus'
import { tableLoadingData } from 'src/utils/loadingData/tableResults'
import { humanize, titleize } from 'underscore.string'

import { NonIdealStateWarning } from '../Shared/NonIdealStates'
import { ExportTableButton } from './ExportTableButton'
import { GenerateCodeButton } from './GenerateCodeButton'
import { TableChartMachine } from './tableChartMachine'
import { TablePagingButtons } from './TablePagingButtons'

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

	const { pages, rootUrl, pageNumber, lastQuery } = state.context
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

	return (
		<TableServiceContext.Provider value={{ state, send }}>
			<div
				css={{
					display: 'flex',
					justifyContent: 'flex-end',
					marginBottom: '40px',
				}}
			>
				<GenerateCodeButton query={lastQuery} rootUrl={rootUrl} />
				<ExportTableButton query={lastQuery} rootUrl={rootUrl} />
			</div>
			<TablePagingButtons />
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
