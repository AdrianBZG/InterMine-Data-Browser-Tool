import { Button } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import { css } from 'linaria'
import React from 'react'

import { NumberedSelectMenuItems } from '../Selects'
import * as S from './FormGroups'

export const Mine = ({ mine, mockMines, setMine }) => {
	return (
		<S.NavFormGroup label="Mine" inline={true} labelFor="mine-select-button">
			<Select
				className={css`
					margin-right: 30px;
				`}
				items={mockMines}
				filterable={false}
				itemRenderer={NumberedSelectMenuItems}
				onItemSelect={setMine}
			>
				<Button
					aria-label="Select Mine"
					id="mine-select-button"
					// used to override `Blueprintjs` styles for a small button
					style={{ minWidth: 166 }}
					small={true}
					text={mine.name}
					alignText="left"
					rightIcon={IconNames.CARET_DOWN}
				/>
			</Select>
		</S.NavFormGroup>
	)
}
