import { Button, Classes, Tab, Tabs } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import { styled } from 'linaria/react'
import React, { useState } from 'react'

import { NumberedSelectMenuItems } from '../Selects'

const S_ViewTabs = styled(Tabs)`
	margin-left: auto;
	margin-right: 20px;

	.${Classes.TAB} {
		font-size: var(--fs-desktopM2);
		font-weight: var(--fw-light);
	}
`

export const ClassSelector = () => {
	const [visibleClasses, setVisibleClasses] = useState([{ name: 'Gene' }, { name: 'Protein' }])
	const [hiddenClasses, setHiddenClasses] = useState([
		{ name: 'Enhancer' },
		{ name: 'Chromosomal Duplication' },
		{ name: 'GWAS' },
	])

	const handleClassSelect = (newClass) => {
		setVisibleClasses([...visibleClasses, newClass])
		setHiddenClasses(hiddenClasses.filter((c) => c.name !== newClass.name))
	}

	return (
		<>
			<S_ViewTabs id="classes-tab">
				{visibleClasses.map((c) => (
					<Tab key={c.name} id={c.name} title={c.name} />
				))}
			</S_ViewTabs>
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
		</>
	)
}
