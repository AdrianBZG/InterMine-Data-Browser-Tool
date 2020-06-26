import { styled } from 'linaria/react'
import React from 'react'

import logo from '../../images/logo.png'
import { NavigationBar } from '../NavBar/NavBar'

const S_Header = styled.header`
	display: inline-flex;
	width: 100%;
`

const S_LogoContainter = styled.div`
	min-width: 230px;
	height: 43px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-right: 2px solid var(--blue5);
	border-bottom: 2px solid var(--blue5);
`

/**
 * Composes elements that sit at the top bar of the app
 */
export const Header = () => {
	return (
		<>
			<S_Header>
				<S_LogoContainter>
					<img width="120px" src={logo} alt="Logo" />
				</S_LogoContainter>
				<NavigationBar />
			</S_Header>
		</>
	)
}
