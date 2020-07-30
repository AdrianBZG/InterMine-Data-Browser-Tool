import { Navbar } from '@blueprintjs/core'
import React from 'react'
import { CHANGE_CLASS } from 'src/eventConstants'
import { useServiceContext } from 'src/machineBus'

import { ClassSelector } from './ClassSelector'
import { ListSelector } from './ListSelector'
import { MineSelector } from './MineSelector'

/**
 *
 */
export const NavigationBar = () => {
	const [state, send] = useServiceContext('appManager')
	const { classView, modelClasses, listsForCurrentClass } = state.context

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
				/>
				<ListSelector listsForCurrentClass={listsForCurrentClass} />
			</Navbar.Group>
		</Navbar>
	)
}
