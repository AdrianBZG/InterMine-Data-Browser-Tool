import { Button, ButtonGroup, Classes, Navbar, Tab, Tabs } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import React, { useState } from 'react'

import { NumberedSelectMenuItems } from '../Selects'
import { Mine } from './MineSelect'

export const NavigationBar = () => {
	const [visibleClasses, setVisibleClasses] = useState([{ name: 'Gene' }, { name: 'Protein' }])
	const [hiddenClasses, setHiddenClasses] = useState([
		{ name: 'Enhancer' },
		{ name: 'Chromosomal Duplication' },
		{ name: 'GWAS' },
	])

	const [selectedTheme, changeTheme] = useState('light')
	const isLightTheme = selectedTheme === 'light'
	const handleClassSelect = (newClass) => {
		setVisibleClasses([...visibleClasses, newClass])
		setHiddenClasses(hiddenClasses.filter((c) => c.name !== newClass.name))
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
					{visibleClasses.map((c) => (
						<Tab key={c.name} id={c.name} title={c.name} />
					))}
				</Tabs>
				<Select
					items={hiddenClasses}
					filterable={true}
					itemRenderer={NumberedSelectMenuItems}
					onItemSelect={handleClassSelect}
				>
					<Button
						aria-label="select the views you'd like to query"
						// used to override `Blueprintjs` styles for a small button
						small={true}
						text="add view"
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
