import { Button, Navbar } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { css } from 'linaria'
import { styled } from 'linaria/react'
import React, { useState } from 'react'

import { ApiStatus } from './ApiStatus'
import { ClassSelector } from './ClassSelector'
import { Mine } from './MineSelect'
import { ThemeControl } from './ThemeControl'

const S_Navbar = styled(Navbar)`
	padding: 0 40px;
`

export const NavigationBar = () => {
	const [mockMines] = useState([
		{ name: 'Human Mine' },
		{ name: 'Fly Mine' },
		{ name: 'Hymenoptera Mine' },
	])
	const [mine, setMine] = useState(mockMines[0])

	return (
		<S_Navbar>
			<Navbar.Group
				className={css`
					width: 100%;
				`}
			>
				<Mine mine={mine} setMine={setMine} mockMines={mockMines} />
				<ApiStatus />
				<ClassSelector />
				<ThemeControl />
				<Button
					className={css`
						margin-left: auto;
						min-width: 80px;
					`}
					text="Reset"
					intent="danger"
					icon={IconNames.ERROR}
				/>
			</Navbar.Group>
		</S_Navbar>
	)
}
