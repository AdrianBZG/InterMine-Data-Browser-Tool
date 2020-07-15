import { Button, ButtonGroup, Classes, Menu, MenuItem, Navbar, Tab, Tabs } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import React, { useEffect, useRef, useState } from 'react'
import { CHANGE_CLASS } from 'src/actionConstants'
import { buildSearchIndex } from 'src/buildSearchIndex'
import { useServiceContext } from 'src/machineBus'
import { pluralizeFilteredCount } from 'src/utils'

import { NumberedSelectMenuItems } from '../Selects'
import { Mine } from './MineSelect'

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

export const NavigationBar = () => {
	const [selectedTheme, changeTheme] = useState('light')
	const isLightTheme = selectedTheme === 'light'

	const [state, send] = useServiceContext('supervisor')
	const { classView, modelClasses } = state.context
	const classSearchIndex = useRef(null)

	useEffect(() => {
		const indexClasses = async () => {
			if (modelClasses.length > 0) {
				classSearchIndex.current = await buildSearchIndex({
					docId: 'name',
					docField: 'displayName',
					values: modelClasses,
				})
			}
		}

		indexClasses()
	}, [modelClasses])

	const classDisplayName =
		modelClasses.find((model) => model.name === classView)?.displayName ?? 'Gene'

	const handleClassSelect = ({ name }) => {
		send({ type: CHANGE_CLASS, newClass: name })
	}

	const filterQuery = (query, items) => {
		if (query === '' || !classSearchIndex?.current) {
			return items
		}

		// flexSearch's default result limit is set 1000, so we set it to the length of all items
		return classSearchIndex.current.search(query, modelClasses.length)
	}

	return (
		<Navbar css={{ padding: '0 40px' }}>
			<Navbar.Group css={{ width: '100%' }}>
				<Mine />
				{/* 
						Navigation Tabs
				  */}
				<Tabs
					id="classes-tab"
					selectedTabId={classView}
					// @ts-ignore
					css={{
						marginLeft: 'auto',
						marginRight: 20,
						[`.${Classes.TAB}`]: {
							fontSize: 'var(--fs-desktopM2)',
							fontWeight: 'var(--fw-light)',
						},
					}}
				>
					<Tab key="Templates" id="Templates" title="Templates" />
					<Tab key={classView} id={classView} title={classDisplayName} />
				</Tabs>
				<Select
					items={state.context.modelClasses}
					filterable={true}
					itemRenderer={NumberedSelectMenuItems}
					onItemSelect={handleClassSelect}
					itemListRenderer={renderMenu}
					itemListPredicate={filterQuery}
					resetOnClose={true}
				>
					<Button
						aria-label="select the views you'd like to query"
						// used to override `Blueprintjs` styles for a small button
						small={true}
						text="change view"
						alignText="left"
						rightIcon={IconNames.CARET_DOWN}
					/>
				</Select>
				{/* 
						Theme controls
				 */}
				<ButtonGroup css={{ marginLeft: 'auto' }}>
					<Button
						active={isLightTheme}
						intent={isLightTheme ? 'primary' : 'none'}
						icon={IconNames.FLASH}
						onClick={() => changeTheme('light')}
					/>
					<Button
						active={!isLightTheme}
						intent={isLightTheme ? 'none' : 'primary'}
						icon={IconNames.MOON}
						onClick={() => changeTheme('dark')}
					/>
				</ButtonGroup>
				{/* 
						Reset all button
				 */}
				<Button
					css={{
						marginLeft: 'auto',
						minWidth: 80,
					}}
					text="Reset"
					intent="danger"
					icon={IconNames.ERROR}
				/>
			</Navbar.Group>
		</Navbar>
	)
}
