import { Button, Navbar } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import React, { useState } from 'react'

import { ApiStatus } from './ApiStatus'
import { ClassSelector } from './ClassSelector'
import { Mine } from './MineSelect'
import { ThemeControl } from './ThemeControl'

export const NavigationBar = () => {
	const [mockMines] = useState([
		{ name: 'Human Mine' },
		{ name: 'Fly Mine' },
		{ name: 'Hymenoptera Mine' },
	])
	const [mine, setMine] = useState(mockMines[0])

	return (
		<Navbar css={{ padding: '0 40px' }}>
			<Navbar.Group css={{ width: '100%' }}>
				<Mine mine={mine} setMine={setMine} mockMines={mockMines} />
				<ApiStatus />
				<ClassSelector />
				<ThemeControl />
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
