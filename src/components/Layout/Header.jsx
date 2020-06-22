import { styled } from 'linaria/react'
import React from 'react'

import logo from '../../images/logo.png'
import { NavigationBar } from '../NavBar/NavBar'

const StyledHeader = styled.header`
	display: inline-flex;
	width: 100%;
`

const LogoContainter = styled.div`
	min-width: 230px;
	height: 43px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-right: 2px solid var(--blue5);
	border-bottom: 2px solid var(--blue5);
`

const S = {
	Header: StyledHeader,
	LogoContainter,
}

export const Header = () => {
	return (
		<>
			<S.Header>
				<S.LogoContainter>
					<img width="120px" src={logo} alt="Logo" />
				</S.LogoContainter>
				<NavigationBar />
			</S.Header>
		</>
	)
}
