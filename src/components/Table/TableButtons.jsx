import { Button, ButtonGroup, InputGroup, MenuItem, Position, Tooltip } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import React, { useState } from 'react'

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
			{/* Save as list button */}
			<Button outlined={true} intent="primary" icon={IconNames.CLOUD_UPLOAD} text="Save As List" />
			{/* Code snippet button */}
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
			{/* Export button */}
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
				<InputGroup css={{ width: '30px' }} value={`${pageNumber}`} round={false} />
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
