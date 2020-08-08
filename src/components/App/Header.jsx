import React from 'react'

import logo from '../../images/logo.png'

export const Header = ({ children }) => {
	return (
		<header css={{ display: 'inline-flex', width: '100%' }}>
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
			{children}
		</header>
	)
}
