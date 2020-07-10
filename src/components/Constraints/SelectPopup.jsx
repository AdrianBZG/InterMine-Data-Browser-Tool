import { Button, Classes, Divider, FormGroup, H4, Menu, MenuItem } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Suggest } from '@blueprintjs/select'
import React, { useEffect, useRef, useState } from 'react'
import { FixedSizeList as List } from 'react-window'
import { ADD_CONSTRAINT, REMOVE_CONSTRAINT } from 'src/actionConstants'
import { generateId } from 'src/generateId'

import { useServiceContext } from '../../machineBus'
import { NoValuesProvided } from './NoValuesProvided'

const ConstraintItem = ({ index, style, data }) => {
	const { filteredItems, activeItem, handleItemSelect, infoText } = data

	if (index === 0) {
		return <MenuItem disabled={true} text={infoText} />
	}

	// subtract 1 because we're adding an informative menu item before all items
	const name = filteredItems[index - 1].name

	return (
		<MenuItem
			key={name}
			text={name}
			style={style}
			active={name === activeItem.name}
			onClick={() => handleItemSelect({ name })}
		/>
	)
}

const VirtualizedMenu = ({
	filteredItems,
	itemsParentRef,
	query,
	activeItem,
	handleItemSelect,
}) => {
	const listRef = useRef(null)

	const isPlural = filteredItems.length > 1 ? 's' : ''
	const infoText =
		query === ''
			? `Showing ${filteredItems.length} Item${isPlural}`
			: `Found ${filteredItems.length} item${isPlural} matching "${query}"`

	useEffect(() => {
		if (listRef?.current) {
			const itemLocation = filteredItems.findIndex((item) => item.name === activeItem.name)
			// add one to offset the menu description item
			listRef.current.scrollToItem(itemLocation + 1)
		}
	}, [activeItem, filteredItems])

	const ulWrapper = ({ children, style }) => {
		return (
			<Menu style={style} ulRef={itemsParentRef}>
				{children}
			</Menu>
		)
	}

	return (
		<List
			ref={listRef}
			height={Math.min(200, (filteredItems.length + 1) * 30)}
			itemSize={30}
			width={300}
			// add 1 because we're adding an informative menu item before all items
			itemCount={filteredItems.length + 1}
			innerElementType={ulWrapper}
			className={Classes.MENU}
			style={{ listStyle: 'none' }}
			itemData={{
				filteredItems,
				activeItem,
				handleItemSelect,
				infoText,
			}}
		>
			{ConstraintItem}
		</List>
	)
}

const renderMenu = (handleItemSelect) => ({ filteredItems, itemsParentRef, query, activeItem }) => (
	<VirtualizedMenu
		filteredItems={filteredItems}
		itemsParentRef={itemsParentRef}
		query={query}
		activeItem={activeItem}
		handleItemSelect={handleItemSelect}
	/>
)

export const SelectPopup = ({
	nonIdealTitle = undefined,
	nonIdealDescription = undefined,
	label = '',
}) => {
	const [uniqueId] = useState(() => `selectPopup-${generateId()}`)
	const [state, send] = useServiceContext('constraints')
	const { availableValues, selectedValues, searchIndex } = state.context

	if (availableValues.length === 0) {
		return <NoValuesProvided title={nonIdealTitle} description={nonIdealDescription} />
	}

	// Blueprintjs requires a value renderer to display a value when selected. But we add
	// the value directly to the added constraints list when clicked, so we reset the input here
	const renderInputValue = () => ''

	const filterQuery = (query, items) => {
		if (query === '') {
			return items.filter((i) => !selectedValues.includes(i.name))
		}

		// flexSearch's default result limit is set 1000, so we set it to the length of all items
		const results = searchIndex.search(query, availableValues.length)

		return results.flatMap((value) => {
			if (selectedValues.includes(value)) {
				return []
			}

			const item = items.find((it) => it.name === value)

			return [{ name: item.name, count: item.count }]
		})
	}

	const handleItemSelect = ({ name }) => {
		send({ type: ADD_CONSTRAINT, constraint: name })
	}

	const handleButtonClick = (constraint) => () => {
		send({ type: REMOVE_CONSTRAINT, constraint })
	}

	return (
		<div>
			{selectedValues.length > 0 && (
				<>
					<H4 css={{ paddingTop: 8, marginBottom: 4 }}>
						{`${selectedValues.length > 1 ? 'Constraints' : 'Constraint'} Added`}
					</H4>
					<ul css={{ padding: '0 16px', listStyle: 'none', marginTop: 0 }}>
						{selectedValues.map((constraint) => {
							return (
								<li
									key={constraint}
									css={{
										display: 'flex',
										alignItems: 'center',
										padding: '6px 0',
									}}
								>
									<Button
										intent="danger"
										icon={IconNames.REMOVE}
										small={true}
										minimal={true}
										// We handle
										onClick={handleButtonClick(constraint)}
										aria-label={`delete ${constraint}`}
										css={{ marginRight: 4 }}
									/>
									<span css={{ fontSize: 'var(--fs-desktopM1)', display: 'inline-block' }}>
										{constraint}
									</span>
								</li>
							)
						})}
					</ul>
					<Divider />
				</>
			)}
			<FormGroup labelFor={uniqueId} label={label} css={{ paddingTop: 24 }}>
				<Suggest
					// @ts-ignore
					id={`selectPopup-${uniqueId}`}
					items={availableValues.map((i) => ({ name: i.item, count: i.count }))}
					inputValueRenderer={renderInputValue}
					fill={true}
					resetOnSelect={true}
					itemListRenderer={renderMenu(handleItemSelect)}
					onItemSelect={handleItemSelect}
					itemListPredicate={filterQuery}
					popoverProps={{ captureDismiss: true }}
				/>
			</FormGroup>
		</div>
	)
}
