import { Classes, FormGroup, H6, Menu, MenuItem, ProgressBar, Tag, Text } from '@blueprintjs/core'
import { Suggest } from '@blueprintjs/select'
import React, { useEffect, useRef, useState } from 'react'
import { FixedSizeList as List } from 'react-window'
import { ADD_CONSTRAINT, REMOVE_CONSTRAINT } from 'src/eventConstants'
import { generateId } from 'src/generateId'
import { useServiceContext } from 'src/useEventBus'
import { pluralizeFilteredCount } from 'src/utils'

import { NoValuesProvided } from '../Shared/NoValuesProvided'

const ConstraintItem = ({ index, style, data }) => {
	const { filteredItems, activeItem, handleItemSelect, infoText, isLoading } = data

	if (index === 0) {
		return <MenuItem disabled={true} text={isLoading ? 'Retrieving values' : infoText} />
	}

	const valueProp = 'item' in activeItem ? 'item' : 'value'
	// subtract 1 because we're adding an informative menu item before all items
	const name = filteredItems[index - 1][valueProp]

	return (
		<MenuItem
			key={name}
			text={name}
			style={style}
			active={name === activeItem[valueProp]}
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
	isLoading,
}) => {
	const listRef = useRef(null)
	const infoText = pluralizeFilteredCount(filteredItems, query)

	useEffect(() => {
		if (listRef?.current) {
			const itemLocation = filteredItems.findIndex((item) => {
				return item.item === activeItem.item || item.value === activeItem.value
			})
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
		<>
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
					isLoading,
				}}
			>
				{ConstraintItem}
			</List>
			{isLoading && <ProgressBar intent="primary" />}
		</>
	)
}

/**
 * This bit of indirection is needed since Blueprintjs requires a regular function to render a filtered list,
 * but the rules of react require that hooks be at the top level of either another hook or a react component.
 */
const renderMenu = (handleItemSelect, isLoading) => ({
	filteredItems,
	itemsParentRef,
	query,
	activeItem,
}) => (
	<VirtualizedMenu
		filteredItems={filteredItems}
		itemsParentRef={itemsParentRef}
		query={query}
		activeItem={activeItem}
		handleItemSelect={handleItemSelect}
		isLoading={isLoading}
	/>
)

export const SuggestWidget = ({
	nonIdealTitle = undefined,
	nonIdealDescription = undefined,
	operationLabel = null,
	searchIndex,
	docField = '',
}) => {
	const [uniqueId] = useState(() => `suggestWidget-${generateId()}`)
	const [state, send] = useServiceContext('constraints')
	const { availableValues, selectedValues } = state.context

	const isLoading = state.matches('loading')

	if (state.matches('noConstraintItems') || state.matches('noValuesForConstraint')) {
		return <NoValuesProvided title={nonIdealTitle} description={nonIdealDescription} />
	}

	// Blueprintjs requires a value renderer to display a value when selected. But we add
	// the value directly to the added constraints list when clicked, so we reset the input here
	const renderInputValue = () => ''
	const filterQuery = (query, items) => {
		if (query === '' || searchIndex.current === null) {
			return items.filter((i) => !selectedValues.includes(i.item))
		}

		const negateSelected = selectedValues.map((val) => ({
			field: docField,
			query: val,
			bool: 'not',
		}))

		// flexSearch's default result limit is set 1000, so we set it to the length of all items
		const results = searchIndex.current.search(
			[
				{
					field: docField,
					query,
					bool: 'and',
				},
				...negateSelected,
			],
			availableValues.length
		)

		return results
	}

	const handleItemSelect = ({ name }) => {
		send({ type: ADD_CONSTRAINT, constraint: name })
	}

	return (
		<div>
			{selectedValues.length > 0 && (
				<div css={{ display: 'flex', alignItems: 'center' }}>
					{state.context.op && <H6 css={{ margin: '0 10px 0 0' }}>{state.context.op}</H6>}
					<div>
						{selectedValues.map((val) => (
							<Tag
								key={val}
								intent="primary"
								css={{ margin: 4 }}
								onRemove={() => send({ type: REMOVE_CONSTRAINT, constraint: val })}
							>
								<Text ellipsize={true}>{val}</Text>
							</Tag>
						))}
					</div>
				</div>
			)}
			<FormGroup
				labelFor={uniqueId}
				inline={true}
				css={{ paddingTop: 14, [`& .${Classes.FORM_CONTENT}`]: { display: 'flex', width: '100%' } }}
			>
				{operationLabel && (
					<div
						css={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							marginRight: 5,
							border: '1px solid var(--grey3)',
							borderRadius: 3,
							width: 100,
							height: 30,
						}}
					>
						{operationLabel}
					</div>
				)}
				<Suggest
					// @ts-ignore
					id={uniqueId}
					items={availableValues}
					inputValueRenderer={renderInputValue}
					fill={true}
					resetOnSelect={true}
					itemListRenderer={renderMenu(handleItemSelect, isLoading)}
					onItemSelect={({ item }) => handleItemSelect({ name: item })}
					itemListPredicate={filterQuery}
					popoverProps={{ captureDismiss: true }}
				/>
			</FormGroup>
		</div>
	)
}
