import { Button, Menu, MenuItem } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import React, { useEffect, useRef, useState } from 'react'
import { buildSearchIndex } from 'src/buildSearchIndex'
import { ADD_LIST_CONSTRAINT, ADD_LIST_TAG } from 'src/eventConstants'
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
				/>
			}
		/>
	)
}
/**
 *
 */
const renderMenu = ({ filteredItems, itemsParentRef, query, renderItem }) => {
	const renderedItems = filteredItems.map(renderItem)
	const infoText = pluralizeFilteredCount(filteredItems, query)

	return (
		<Menu ulRef={itemsParentRef}>
			<MenuItem disabled={true} text={infoText} />
			{renderedItems}
		</Menu>
	)
}

export const ListSelector = ({ listsForCurrentClass }) => {
	const listSearchIndex = useRef(null)
	const [selectedValues, setSelectedValues] = useState([])

	useEffect(() => {
		const indexClasses = async () => {
			if (listsForCurrentClass.length > 0) {
				listSearchIndex.current = await buildSearchIndex({
					docId: 'listName',
					docField: 'displayName',
					values: listsForCurrentClass,
				})
			}
		}

		indexClasses()
	}, [listsForCurrentClass])

	const filterQuery = (query, items) => {
		if (query === '' || !listSearchIndex?.current) {
			return items.filter((item) => !selectedValues.includes(item.displayName))
		}

		const negateSelected = selectedValues.map((val) => ({
			field: 'displayName',
			query: val,
			bool: 'not',
		}))

		// flexSearch's default result limit is set 1000, so we set it to the length of all items
		return listSearchIndex.current.search(
			[
				{
					query,
					field: 'displayName',
					bool: 'and',
				},
				...negateSelected,
			],
			listsForCurrentClass.length
		)
	}

	const handleListSelect = ({ displayName, listName }) => {
		setSelectedValues([...selectedValues, displayName])
		// @ts-ignore
		sendToBus({ type: ADD_LIST_CONSTRAINT, listName })
		// @ts-ignore
		sendToBus({ type: ADD_LIST_TAG, listName })
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
				itemListRenderer={renderMenu}
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
				<ConstraintSetTag constraintApplied={selectedValues.length > 0} text="List Set" />
			</div>
		</div>
	)
}
