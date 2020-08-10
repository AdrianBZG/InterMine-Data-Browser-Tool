import 'highlight.js/styles/github.css'

import {
	Button,
	ButtonGroup,
	Code,
	ControlGroup,
	Dialog,
	FormGroup,
	InputGroup,
	MenuItem,
	Pre,
} from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import { saveAs } from 'file-saver'
import hljs from 'highlight.js/lib/core'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import perl from 'highlight.js/lib/languages/perl'
import python from 'highlight.js/lib/languages/python'
import ruby from 'highlight.js/lib/languages/ruby'
// html is aliased as xml
import html from 'highlight.js/lib/languages/xml'
import hash from 'object-hash'
import React, { useEffect, useState } from 'react'
import { usePrevious } from 'react-use'
import { fetchCode } from 'src/apiRequests'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('html', html)
hljs.registerLanguage('java', java)
hljs.registerLanguage('perl', perl)
hljs.registerLanguage('python', python)
hljs.registerLanguage('ruby', ruby)

/**
 *
 */
const codeNameToExtension = (lang) => {
	switch (lang) {
		case 'Python':
			return 'py'
		case 'Javascript':
			return 'js'
		case 'Perl':
			return 'pl'
		case 'Ruby':
			return 'rb'
		case 'Java':
			return 'java'
		default:
			return 'js'
	}
}

/**
 *
 */
const CodeButtonSelect = ({
	setLang,
	intent,
	text = '',
	icon = null,
	rightIcon = null,
	outlined = false,
	wrapperStyles = {},
	buttonStyles = {},
}) => {
	return (
		<Select
			filterable={false}
			items={['Javascript', 'Perl', 'Python', 'Ruby', 'Java']}
			itemRenderer={(lang, { handleClick }) => {
				// @ts-ignore
				return <MenuItem key={lang} text={lang} onClick={handleClick} />
			}}
			onItemSelect={setLang}
			css={wrapperStyles}
		>
			<Button
				intent={intent}
				icon={icon}
				rightIcon={rightIcon}
				text={text}
				outlined={outlined}
				css={buttonStyles}
				alignText="left"
			/>
		</Select>
	)
}

/**
 *
 */
const FileNameInput = ({ fileName, setFileName, setLang, lang }) => {
	return (
		<ControlGroup css={{ display: 'flex' }}>
			<FormGroup label="Filename" labelFor="generate-code" labelInfo="(optional)">
				<InputGroup
					id="generate-code"
					value={fileName}
					fill={false}
					css={{ width: 160 }}
					onChange={(e) => setFileName(e.target.value)}
				/>
			</FormGroup>
			<CodeButtonSelect
				setLang={setLang}
				intent="none"
				rightIcon={IconNames.CARET_DOWN}
				text={lang}
				buttonStyles={{ width: 112 }}
				wrapperStyles={{ alignSelf: 'center', marginTop: 8 }}
			/>
		</ControlGroup>
	)
}

/**
 *
 */
const GenerateCodeDialog = ({ lang, handleDialogClose, isOpen, query, rootUrl, setLang }) => {
	const prevLang = usePrevious(lang)
	const [code, setCode] = useState({})
	const [fileName, setFileName] = useState('query')
	const [, setErrorDownloading] = useState(false)
	const [lastQuery, setLastQuery] = useState('')

	const fileExtension = codeNameToExtension(lang)
	const previousFileExtension = codeNameToExtension(lang)

	const fetchCodePreview = async () => {
		const nextQuery = hash(query)
		let codeCache = { ...code }

		if (nextQuery !== lastQuery) {
			codeCache = {}
			setLastQuery(nextQuery)
		}

		try {
			const file = await fetchCode({
				query,
				rootUrl,
				codeCache,
				fileExtension,
				isSameQuery: nextQuery === lastQuery,
			})

			if (file) {
				setCode({
					...codeCache,
					[fileExtension]: {
						highlighted: hljs.highlightAuto(file).value,
						plain: file,
					},
				})
			}
		} catch (e) {
			// Todo: show error message
			setErrorDownloading(true)
			console.error(`Error fetching code: ${e}`)
		}
	}

	useEffect(() => {
		if (isOpen && prevLang !== lang) {
			fetchCodePreview()
		}
	})

	const handleFileSave = () => {
		const blob = new Blob([code[fileExtension].plain])
		saveAs(blob, `${fileName}.${fileExtension}`)
	}

	const renderCode = code[fileExtension] || code[previousFileExtension]

	return (
		<Dialog
			title="Generate code snippet"
			isOpen={isOpen}
			canEscapeKeyClose={true}
			onClose={handleDialogClose}
			onOpening={fetchCodePreview}
			css={{ width: '60vw', maxWidth: 1000 }}
		>
			<div css={{ padding: 20, display: 'flex', maxHeight: '500px' }}>
				<div css={{ marginTop: 20, marginRight: 20 }}>
					<FileNameInput
						fileName={fileName}
						setFileName={setFileName}
						setLang={setLang}
						lang={lang}
					/>
					<Button
						intent="primary"
						icon={IconNames.ARCHIVE}
						text="Download code"
						onClick={handleFileSave}
						css={{ marginTop: 10 }}
					/>
				</div>
				<Pre
					css={{
						overflow: 'scroll',
						minWidth: code[fileExtension] ? 'auto' : 500,
						minHeight: code[fileExtension] ? 'auto' : 400,
					}}
				>
					{renderCode ? (
						<Code
							dangerouslySetInnerHTML={{
								__html:
									code[fileExtension]?.highlighted ?? code[previousFileExtension]?.highlighted,
							}}
						/>
					) : (
						<div>Fetching code. Please be patient...</div>
					)}
				</Pre>
			</div>
		</Dialog>
	)
}

/**
 *
 */
export const GenerateCodeButton = ({ query, rootUrl }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [lang, setLang] = useState('Javascript')

	const handleDialogClose = () => setIsOpen(false)

	return (
		<ButtonGroup css={{ margin: '0px 16px' }}>
			<Button
				intent="primary"
				outlined={true}
				icon={IconNames.CODE}
				text={lang}
				alignText="left"
				onClick={() => setIsOpen(true)}
				css={{ width: 112 }}
			/>
			<GenerateCodeDialog
				lang={lang}
				handleDialogClose={handleDialogClose}
				isOpen={isOpen}
				query={query}
				rootUrl={rootUrl}
				setLang={setLang}
			/>
			<CodeButtonSelect
				setLang={setLang}
				intent="primary"
				icon={IconNames.CARET_DOWN}
				outlined={true}
			/>
		</ButtonGroup>
	)
}
