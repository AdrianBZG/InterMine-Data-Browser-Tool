import {
	Button,
	ButtonGroup,
	Classes,
	HTMLTable,
	Icon,
	InputGroup,
	MenuItem,
	Position,
	Tooltip,
} from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import React, { useState } from 'react'
import { noop } from 'src/utils'
import { humanize, titleize } from 'underscore.string'
import { Machine } from 'xstate'

import { useMachineBus } from '../../machineBus'
import { humanMine25 } from '../../stubs/humanMine25'
import { mineUrl } from '../../stubs/utils'

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
	const [pageNumber, setPageNumber] = useState(1)

	return (
		<div>
			<ButtonGroup>
				<Tooltip content="Previous Page" position={Position.TOP}>
					<Button
						icon={IconNames.CHEVRON_BACKWARD}
						disabled={pageNumber === 1}
						onClick={() => setPageNumber(pageNumber - 1)}
					/>
				</Tooltip>
				<InputGroup css={{ width: '30px' }} onChange={noop} value={`${pageNumber}`} round={false} />
				<Tooltip content="Next Page" position={Position.TOP}>
					<Button
						icon={IconNames.CHEVRON_FORWARD}
						disabled={pageNumber === 3}
						onClick={() => setPageNumber(pageNumber + 1)}
					/>
				</Tooltip>
			</ButtonGroup>
		</div>
	)
}

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
