import { Button, Navbar } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import React from 'react'
import { CHANGE_CLASS, RESET_VIEW } from 'src/eventConstants'
import { useEventBus, useServiceContext } from 'src/useEventBus'

import { ClassSelector } from './ClassSelector'
import { ListSelector } from './ListSelector'
import { MineSelector } from './MineSelector'

/**
 *
 */
export const NavigationBar = () => {
	const [state, send] = useServiceContext('appManager')
	const { classView, modelClasses, listsForCurrentClass, selectedMine } = state.context
	const [sendToBus] = useEventBus()

	const handleClassSelect = ({ name }) => {
		send({ type: CHANGE_CLASS, newClass: name })
	}

	return (
		<Navbar css={{ padding: '0 40px' }}>
			<Navbar.Group css={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
				<MineSelector />
				<ClassSelector
					handleClassSelect={handleClassSelect}
					modelClasses={modelClasses}
					classView={classView}
					mineName={selectedMine.name}
				/>
				<ListSelector
					listsForCurrentClass={listsForCurrentClass}
					mineName={selectedMine.name}
					classView={classView}
				/>
				<Button
					text="Reset all"
					intent="danger"
					icon={IconNames.ERROR}
					css={{ marginLeft: 'auto' }}
					onClick={() => {
						sendToBus({ type: RESET_VIEW })
					}}
				/>
			</Navbar.Group>
		</Navbar>
	)
}
