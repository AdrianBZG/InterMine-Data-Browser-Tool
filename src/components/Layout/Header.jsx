import React from 'react'

import logo from '../../images/logo.png'
import { NavigationBar } from '../NavBar/NavBar'

/**
 * Composes elements that sit at the top bar of the app
 */
export const Header = () => {
	return (
		<>
			<header
				css={{
					display: 'inline-flex',
					width: '100%',
				}}
			>
				<div
					css={{
						minWidth: '230px',
						height: 43,
						display: 'inline-flex',
						alignItems: 'center',
						justifyContent: 'center',
						borderRight: '2px solid var(--blue5)',
						borderBottom: '2px solid var(--blue5)',
					}}
				>
					<img width="120px" src={logo} alt="Logo" />
				</div>
				<NavigationBar />
			</header>
		</>
	)
}
