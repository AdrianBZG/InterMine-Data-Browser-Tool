import { Button, Colors, Icon, InputGroup, Popover } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import React, { useEffect, useState } from 'react'
import { CHANGE_MINE, SET_API_TOKEN } from 'src/eventConstants'
import { useEventBus, usePartialContext } from 'src/useEventBus'

import { NumberedSelectMenuItems } from '../Shared/Selects'

export const MineSelector = () => {
	const [state, sendToAppManager] = usePartialContext('appManager', (ctx) => ({
		apiToken: ctx.selectedMine.apiToken,
		rootUrl: ctx.selectedMine.rootUrl,
		intermines: ctx.intermines,
		mineName: ctx.selectedMine.name,
	}))

	const [showPopup, setShowPopup] = useState(false)
	const [sendToBus] = useEventBus()

	const { apiToken: token, rootUrl, intermines, mineName } = state
	const [apiToken, setApiToken] = useState(token)
	const [currentMine, setCurrentMine] = useState(rootUrl)

	useEffect(() => {
		if (currentMine !== rootUrl) {
			setCurrentMine(rootUrl)
			setApiToken(apiToken)
		}
	}, [apiToken, currentMine, rootUrl])

	const handleMineChange = ({ name }) => {
		// @ts-ignore
		sendToBus({ type: CHANGE_MINE, newMine: name })
	}

	const isAuthenticated = apiToken.length > 0

	return (
		<div css={{ display: 'flex' }}>
			{/* 
					mine selection
		  */}
			<div css={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
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
						text={mineName}
						alignText="left"
						rightIcon={IconNames.CARET_DOWN}
					/>
				</Select>
			</div>
			{/* 
			       Api Status
			 */}
			<div css={{ display: 'flex', alignItems: 'center', marginLeft: 20 }}>
				<span
					// @ts-ignore
					css={{
						fontSize: 'var(--fs-desktopM2)',
						fontWeight: 'var(--fw-regular)',
						marginRight: 8,
						marginBottom: 0,
					}}
				>
					Key
				</span>
				<Popover
					onClose={() => sendToAppManager({ type: SET_API_TOKEN, apiToken })}
					isOpen={showPopup}
					onInteraction={(nextState) => setShowPopup(nextState)}
				>
					<Button
						aria-label="api-status"
						small={true}
						icon={
							<Icon icon={IconNames.KEY} color={isAuthenticated ? Colors.GREEN5 : Colors.RED3} />
						}
					/>
					<InputGroup
						large={true}
						leftIcon="key"
						onChange={(e) => setApiToken(e.target.value)}
						placeholder="Enter your api key"
						value={apiToken}
						onKeyDown={(e) => {
							const code = e.keyCode ? e.keyCode : e.which
							// enter key
							if (code === 13) {
								setShowPopup(false)
							}
						}}
					/>
				</Popover>
			</div>
		</div>
	)
}
