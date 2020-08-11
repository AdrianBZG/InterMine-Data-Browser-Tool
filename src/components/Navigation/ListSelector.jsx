import { Button, Menu, MenuItem } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import { useMachine } from '@xstate/react'
import React, { useEffect, useRef } from 'react'
import { buildSearchIndex } from 'src/buildSearchIndex'
import { DEFAULT_VIEW, TEMPLATE_VIEW } from 'src/constants'
import {
	ADD_LIST_TO_OVERVIEW,
	ADD_LIST_TO_TEMPLATE,
	REHYDRATE_LIST_TO_TEMPLATE,
	REMOVE_LIST_FROM_OVERVIEW,
	REMOVE_LIST_FROM_TEMPLATE,
} from 'src/eventConstants'
import { useEventBus, usePartialContext } from 'src/useEventBus'
import { pluralizeFilteredCount } from 'src/utils'

import { ConstraintSetTag } from '../Shared/ConstraintSetTag'
import { InfoIconPopover } from '../Shared/InfoIconPopover'
import { listSelectorMachine } from './listSelectorMachine'

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
const renderMenu = (selectedListName) => ({ filteredItems, itemsParentRef, query, renderItem }) => {
	const renderedItems = filteredItems.map(renderItem)
	const infoText = pluralizeFilteredCount(filteredItems, query)

	const renderSelected = (
		<>
			<MenuItem disabled={true} text="Selected list (click to remove)" />
			{renderItem({
				listName: selectedListName,
				displayName: selectedListName,
				isSelected: true,
			})}
		</>
	)

	return (
		<Menu ulRef={itemsParentRef}>
			{selectedListName !== '' && renderSelected}
			<MenuItem disabled={true} text={infoText} />
			{renderedItems}
		</Menu>
	)
}

export const ListSelector = () => {
	const [appState] = usePartialContext('appManager', (ctx) => ({
		appView: ctx.appView,
		mineName: ctx.selectedMine.name,
		classView: ctx.classView,
		listsForCurrentClass: ctx.listsForCurrentClass,
	}))

	const { appView, mineName, classView, listsForCurrentClass } = appState

	const [state, , service] = useMachine(listSelectorMachine)
	const { listForOverview, listForTemplate } = state.context

	const [sendToBus] = useEventBus(service)

	const listSearchIndex = useRef(null)

	const selectedListName =
		(appView === DEFAULT_VIEW ? listForOverview?.displayName : listForTemplate?.displayName) ?? ''

	useEffect(() => {
		// This will log a warning to the console about an uninitialized service. You can disregard that
		// because it means the template machines and it's spawned children haven't started yet. But they will
		// and the event will be deferred until they do. This can be removed once a better model, probably using
		// another machine is created.
		if (selectedListName !== '' && appView === TEMPLATE_VIEW) {
			sendToBus({
				type: REHYDRATE_LIST_TO_TEMPLATE,
				// @ts-ignore
				listName: listForTemplate.listName,
			})
		}
	})

	useEffect(() => {
		const indexClasses = async () => {
			if (listsForCurrentClass.length > 0) {
				listSearchIndex.current = await buildSearchIndex({
					docId: 'listName',
					docField: 'displayName',
					values: listsForCurrentClass,
					query: { listsForCurrentClass, mineName, name: `${mineName}-${classView}-lists` },
				})
			}
		}

		indexClasses()
	}, [classView, listsForCurrentClass, mineName])

	const filterQuery = (query, items) => {
		if (query === '' || !listSearchIndex?.current) {
			return items.filter((item) => item.displayName !== selectedListName)
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
					query: selectedListName,
					bool: 'not',
				},
			],
			listsForCurrentClass.length
		)
	}

	const handleListSelect = ({ displayName, listName }) => {
		if (displayName === selectedListName) {
			const type = appView === DEFAULT_VIEW ? REMOVE_LIST_FROM_OVERVIEW : REMOVE_LIST_FROM_TEMPLATE

			sendToBus({ type })
		} else {
			const type = appView === DEFAULT_VIEW ? ADD_LIST_TO_OVERVIEW : ADD_LIST_TO_TEMPLATE
			// @ts-ignore
			sendToBus({ type, listName, displayName })
		}
	}

	return (
		<div css={{ display: 'flex', alignItems: 'center' }}>
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
				itemListRenderer={renderMenu(selectedListName)}
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
					constraintApplied={selectedListName !== ''}
					text={selectedListName === '' ? 'No list set' : selectedListName}
					ellipsize={true}
				/>
			</div>
		</div>
	)
}
