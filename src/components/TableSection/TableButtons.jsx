import { Button, ButtonGroup, InputGroup, MenuItem, Position, Tooltip } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import { styled } from 'linaria/react'
import React, { useState } from 'react'

const ButtonRow = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-bottom: 40px;
`
const StyledCodeSnippet = styled(ButtonGroup)`
	margin: 0px 16px;
`

const StyledInputGroup = styled(InputGroup)`
	width: 30px;
`

const S = {
	ButtonRow,
	CodeSnippet: StyledCodeSnippet,
	PageInput: StyledInputGroup,
}

const SaveAsList = () => (
	<Button outlined={true} intent="primary" icon={IconNames.CLOUD_UPLOAD} text="Save As List" />
)

const renderLanguage = (lang, { handleClick }) => (
	<MenuItem key={lang} text={lang} onClick={handleClick} />
)

const CodeSnippet = () => {
	const [selectedLanguage, setLanguage] = useState('Python')

	return (
		<S.CodeSnippet>
			<Button
				outlined={true}
				intent="primary"
				icon={IconNames.CODE}
				text={`Generate ${selectedLanguage} code`}
			/>
			<Select
				filterable={false}
				items={['Python', 'Perl', 'Java', 'Ruby', 'Javascript', 'XML']}
				itemRenderer={renderLanguage}
				onItemSelect={setLanguage}
			>
				<Button outlined={true} intent="primary" icon={IconNames.CARET_DOWN} />
			</Select>
		</S.CodeSnippet>
	)
}

const Export = () => (
	<Button intent="primary" outlined={true} icon={IconNames.ARCHIVE} text="Export" />
)

export const TableActionButtons = () => {
	return (
		<S.ButtonRow>
			<SaveAsList />
			<CodeSnippet />
			<Export />
		</S.ButtonRow>
	)
}

const PageButtons = () => {
	const [pageNumber, setPageNumber] = useState(1)

	return (
		<ButtonGroup>
			<Tooltip content="Previous Page" position={Position.TOP}>
				<Button
					icon={IconNames.CHEVRON_BACKWARD}
					disabled={pageNumber === 1}
					onClick={() => setPageNumber(pageNumber - 1)}
				/>
			</Tooltip>
			<S.PageInput value={pageNumber} round={false} />
			<Tooltip content="Next Page" position={Position.TOP}>
				<Button
					icon={IconNames.CHEVRON_FORWARD}
					disabled={pageNumber === 3}
					onClick={() => setPageNumber(pageNumber + 1)}
				/>
			</Tooltip>
		</ButtonGroup>
	)
}

export const TablePagingButtons = () => {
	return (
		<div>
			<PageButtons />
		</div>
	)
}
