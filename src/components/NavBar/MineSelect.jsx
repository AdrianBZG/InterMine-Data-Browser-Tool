import { Button } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import React from 'react'

import { NumberedSelectMenuItems } from '../Selects'

export const Mine = ({ mine, mockMines, setMine }) => {
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
				Mine
			</span>
			<Select
				css={{ marginRight: 30 }}
				items={mockMines}
				filterable={false}
				itemRenderer={NumberedSelectMenuItems}
				onItemSelect={setMine}
			>
				<Button
					aria-label="Select Mine"
					// used to override `Blueprintjs` styles for a small button
					style={{ minWidth: 166 }}
					small={true}
					text={mine.name}
					alignText="left"
					rightIcon={IconNames.CARET_DOWN}
				/>
			</Select>
		</div>
	)
}
