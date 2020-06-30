import { Classes, HTMLTable, Icon } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import PropTypes from 'prop-types'
import React from 'react'
import { humanize, titleize } from 'underscore.string'
import { Machine } from 'xstate'

import { useMachineBus } from '../../machineBus'
import { humanMine25 } from '../../stubs/humanMine25'
import { mineUrl } from '../../stubs/utils'
import { TableActionButtons, TablePagingButtons } from './'

const ColumnHeader = ({ columnName }) => {
	const name = titleize(humanize(columnName.replace(/\./g, ' ')))
	const words = name.split(' ')
	const className = words.shift()
	const specifier = words.join(' ')

	return (
		<th scope="col" title={`${className} ${specifier}`}>
			<span css={{ display: 'block' }}>{className}</span>
			<span>{specifier}</span>
		</th>
	)
}

const Cell = ({ cell, mineUrl }) => {
	const cellValue = cell.value

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
				<div title={cellValue}>
					<a href={`${mineUrl}${cell.url}`} target="_blank" rel="noopener noreferrer">
						<Icon icon={IconNames.GLOBE_NETWORK} />
						{cellValue}
					</a>
				</div>
			) : (
				<span className={Classes.TEXT_DISABLED}>No Value</span>
			)}
		</td>
	)
}

export const TableChartMachine = Machine({
	id: 'TableChart',
	initial: 'idle',
	context: {
		rows: humanMine25,
		mineUrl,
	},
	states: {
		idle: {},
	},
})

export const Table = () => {
	const [
		{
			context: { rows, mineUrl },
		},
	] = useMachineBus(TableChartMachine)

	return (
		<>
			<TableActionButtons />
			<div css={{ display: 'flex', justifyContent: 'space-between' }}>
				<span
					// @ts-ignore
					css={{
						fontSize: 'var(--fs-desktopM1)',
						fontWeight: '(var(--fw-semibold)',
						marginBottom: 20,
						marginLeft: 10,
						display: 'inline-flex',
					}}
				>
					{`Showing ${rows.length} of ${rows.length} rows`}
				</span>
				<TablePagingButtons />
			</div>
			<HTMLTable css={{ width: '100%' }} interactive={true} striped={true}>
				<thead>
					<tr>
						{rows[0].map((r) => {
							return <ColumnHeader key={r.column} columnName={r.column} />
						})}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, colIdx) => {
						return (
							<tr key={colIdx}>
								{row.map((cell, rowIdx) => (
									<Cell key={`${colIdx}-${rowIdx}`} cell={cell} mineUrl={mineUrl} />
								))}
							</tr>
						)
					})}
				</tbody>
			</HTMLTable>
		</>
	)
}

Table.propTypes = {
	/**
	 * The result from calling `imjs.tableRows()`
	 */
	rows: PropTypes.array.isRequired,
	/**
	 * The base mine url
	 */
	mineUrl: PropTypes.string,
}
