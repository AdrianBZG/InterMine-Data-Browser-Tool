import { Button } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import { css } from 'linaria'
import { styled } from 'linaria/react'
import React from 'react'

import { NumberedSelectMenuItems } from '../Selects'

const S_MineLabel = styled.span`
	font-size: var(--fs-desktopM2);
	font-weight: var(--fw-regular);
	margin-right: 8px;
	margin-bottom: 0;
`

const S_MineContainer = styled.div`
	display: flex;
	align-items: center;
`

export const Mine = ({ mine, mockMines, setMine }) => {
	return (
		<S_MineContainer>
			<S_MineLabel>Mine</S_MineLabel>
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
					// used to override `Blueprintjs` styles for a small button
					style={{ minWidth: 166 }}
					small={true}
					text={mine.name}
					alignText="left"
					rightIcon={IconNames.CARET_DOWN}
				/>
			</Select>
		</S_MineContainer>
	)
}
