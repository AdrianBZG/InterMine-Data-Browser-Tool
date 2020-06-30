import { Classes, HTMLTable, Icon } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { css } from 'linaria'
import { styled } from 'linaria/react'
import PropTypes from 'prop-types'
import React from 'react'
import { humanize, titleize } from 'underscore.string'
import { Machine } from 'xstate'

import { useMachineBus } from '../../machineBus'
import { humanMine25 } from '../../stubs/humanMine25'
import { mineUrl } from '../../stubs/utils'
import { TableActionButtons, TablePagingButtons } from './'
const StyledTable = styled(HTMLTable)`
	width: 100%;
`

const StyledCell = styled.td`
	&& a {
		font-weight: normal;

		& .${Classes.ICON} {
			padding-right: 5px;
		}
	}
`

const S = {
	Cell: StyledCell,
	Table: StyledTable,
}

const ColumnHeader = ({ columnName }) => {
	const name = titleize(humanize(columnName.replace(/\./g, ' ')))
	const words = name.split(' ')
	const className = words.shift()
	const specifier = words.join(' ')

	return (
		<th scope="col" title={`${className} ${specifier}`}>
			<span
				className={css`
					display: block;
				`}
			>
				{className}
			</span>
			<span>{specifier}</span>
		</th>
	)
}

const Cell = ({ cell, mineUrl }) => {
	const cellValue = cell.value

	return (
		<S.Cell scope="row">
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
		</S.Cell>
	)
}

const S_PagingRow = styled.div`
	display: flex;
	justify-content: space-between;
`
const S_RowCount = styled.span`
	font-size: var(--fs-desktopM1);
	font-weight: var(--fw-semibold);
	margin-bottom: 20px;
	margin-left: 10px;
	display: inline-block;
`

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
			<S_PagingRow>
				<S_RowCount>{`Showing ${rows.length} of ${rows.length} rows`}</S_RowCount>
				<TablePagingButtons />
			</S_PagingRow>
			<S.Table interactive={true} striped={true}>
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
			</S.Table>
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
