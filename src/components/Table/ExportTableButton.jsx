import { Button, ControlGroup, Dialog, FormGroup, InputGroup, MenuItem } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import React, { useState } from 'react'
import { exportTable } from 'src/apiRequests'

/**
 *
 */
export const ExportTableButton = ({ query, rootUrl }) => {
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
