import { Button, Colors, Icon } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import React, { useState } from 'react'
import { CHANGE_MINE } from 'src/actionConstants'
import { useServiceContext } from 'src/machineBus'

import { NumberedSelectMenuItems } from '../Selects'

const AuthenticatedIcon = (isAuthenticated) => (
	<Icon
		icon={isAuthenticated ? IconNames.UNLOCK : IconNames.LOCK}
		color={isAuthenticated ? Colors.GREEN5 : Colors.RED3}
	/>
)

export const Mine = () => {
	const [isAuthenticated, setAuthentication] = useState(false)
	const [state, send] = useServiceContext('supervisor')

	const { selectedMine, intermines } = state.context

	const handleMineChange = ({ name }) => {
		send({ type: CHANGE_MINE, newMine: name })
	}

	return (
		<>
			{/* 
					mine selection
		  */}
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
					items={intermines}
					filterable={false}
					itemRenderer={NumberedSelectMenuItems}
					onItemSelect={handleMineChange}
				>
					<Button
						aria-label="Select Mine"
						// used to override `Blueprintjs` styles for a small button
						style={{ minWidth: 166 }}
						small={true}
						text={selectedMine.name}
						alignText="left"
						rightIcon={IconNames.CARET_DOWN}
					/>
				</Select>
			</div>
			{/* 
			       Api Status
			 */}
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
					Api
				</span>
				<Button
					aria-label="api-status"
					small={true}
					icon={AuthenticatedIcon(isAuthenticated)}
					onClick={() => setAuthentication(!isAuthenticated)}
				/>
			</div>
		</>
	)
}
