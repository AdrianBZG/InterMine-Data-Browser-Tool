import { Button, Classes, ControlGroup, InputGroup, Position, Tooltip } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import { CHANGE_PAGE } from 'src/eventConstants'
import { usePartialContext } from 'src/useEventBus'

const RowCount = ({ pageNumber, visibleRows, totalRows, isLoading }) => {
	const previousPage = pageNumber - 1
	const previousPageLastRow = previousPage * visibleRows
	const currentPageFirstRow = previousPageLastRow + 1

	const currentPageLastRow = Math.min(
		totalRows,
		currentPageFirstRow + (visibleRows - 1) /** subtract the first row */
	)

	return (
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
	)
}

/**
 *
 */
export const TablePagingButtons = () => {
	const [state, send, service] = usePartialContext('table', (ctx) => ({
		pageInMachine: ctx.pageNumber,
		visibleRows: ctx.visibleRows,
		totalRows: ctx.totalRows,
	}))

	const [pageNumber, setPageNumber] = useState(1)
	const { pageInMachine, visibleRows, totalRows } = state

	const { isLoading } = service.state.activities

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
		<div css={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
			<RowCount
				pageNumber={pageNumber}
				visibleRows={visibleRows}
				totalRows={totalRows}
				isLoading={isLoading}
			/>
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
		</div>
	)
}
