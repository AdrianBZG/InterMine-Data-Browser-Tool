import { Button, Menu, MenuItem } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import React, { useEffect, useRef, useState } from 'react'
import { buildSearchIndex } from 'src/buildSearchIndex'
import { ADD_LIST_CONSTRAINT, REMOVE_LIST_CONSTRAINT } from 'src/eventConstants'
import { sendToBus } from 'src/useMachineBus'
import { pluralizeFilteredCount } from 'src/utils'

import { ConstraintSetTag } from '../Shared/ConstraintSetTag'
import { InfoIconPopover } from '../Shared/InfoIconPopover'

export const ListMenuItems = (item, props) => {
	return (
		<MenuItem
			key={item.listName}
			text={item.displayName}
			active={props.modifiers.active}
			onClick={props.handleClick}
			icon={
				<InfoIconPopover
					title={item.displayName}
					description={item.description}
					position="left-top"
					intent={item?.isSelected ? 'success' : null}
				/>
			}
		/>
	)
}

/**
 *
 */
const renderMenu = (selectedValue) => ({ filteredItems, itemsParentRef, query, renderItem }) => {
	const renderedItems = filteredItems.map(renderItem)
	const infoText = pluralizeFilteredCount(filteredItems, query)

	const renderSelected = (
		<>
			<MenuItem disabled={true} text="Selected list (click to remove)" />
			{renderItem({
				listName: selectedValue,
				displayName: selectedValue,
				isSelected: true,
			})}
		</>
	)

	return (
		<Menu ulRef={itemsParentRef}>
			{selectedValue !== '' && renderSelected}
			<MenuItem disabled={true} text={infoText} />
			{renderedItems}
		</Menu>
	)
}

export const ListSelector = ({ listsForCurrentClass, mineName }) => {
	const listSearchIndex = useRef(null)
	const [selectedValue, setSelectedValue] = useState('')

	useEffect(() => {
		const indexClasses = async () => {
			if (listsForCurrentClass.length > 0) {
				listSearchIndex.current = await buildSearchIndex({
					docId: 'listName',
					docField: 'displayName',
					values: listsForCurrentClass,
					cacheKey: `${mineName}-listSelector`,
				})
			}
		}

		indexClasses()
	}, [listsForCurrentClass, mineName])

	const filterQuery = (query, items) => {
		if (query === '' || !listSearchIndex?.current) {
			return items.filter((item) => item.displayName !== selectedValue)
		}

		// flexSearch's default result limit is set 1000, so we set it to the length of all items
		return listSearchIndex.current.search(
			[
				{
					query,
					field: 'displayName',
					bool: 'and',
				},
				{
					field: 'displayName',
					query: selectedValue,
					bool: 'not',
				},
			],
			listsForCurrentClass.length
		)
	}

	const handleListSelect = ({ displayName, listName }) => {
		if (displayName === selectedValue) {
			sendToBus({ type: REMOVE_LIST_CONSTRAINT })
			setSelectedValue('')
		} else {
			// @ts-ignore
			sendToBus({ type: ADD_LIST_CONSTRAINT, listName })
			setSelectedValue(displayName)
		}
	}

	return (
		<div css={{ display: 'flex', alignItems: 'center', marginLeft: 40, marginRight: 20 }}>
			<span
				// @ts-ignore
				css={{
					fontSize: 'var(--fs-desktopM2)',
					fontWeight: 'var(--fw-regular)',
					marginRight: 8,
					marginBottom: 0,
				}}
			>
				Lists
			</span>
			<Select
				items={listsForCurrentClass}
				filterable={true}
				itemRenderer={ListMenuItems}
				onItemSelect={handleListSelect}
				itemListRenderer={renderMenu(selectedValue)}
				itemListPredicate={filterQuery}
				resetOnClose={true}
				popoverProps={{ boundary: 'window', usePortal: true, lazy: true }}
			>
				<Button
					aria-label="select the lists you wish to filter by"
					// used to override `Blueprintjs` styles for a small button
					small={true}
					text="filter by list"
					alignText="left"
					rightIcon={IconNames.CARET_DOWN}
				/>
			</Select>
			<div css={{ marginLeft: 10 }}>
				<ConstraintSetTag
					constraintApplied={selectedValue !== ''}
					text={selectedValue === '' ? 'No list set' : selectedValue}
					ellipsize={true}
				/>
			</div>
		</div>
	)
}
