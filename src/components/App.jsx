import { css, cx } from 'linaria'
import React from 'react'

import logo from '../images/logo.svg'
import { useTheme } from '../theme'
import { Constraint } from './Constraints/ConstraintBase'
import { Text } from './Text'

export const App = () => {
	const theme = useTheme()

	return (
		<div className={cx(app, theme.lightTheme)}>
			<header className={appHeader}>
				<img src={logo} className={appLogo} alt="logo" />
				<Text fontSize={'m2'} tagName={'span'}>
					Edit src/App.js and save to reload.
				</Text>
				<a className={appLink} href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
					Learn React
				</a>
				<Constraint />
			</header>
		</div>
	)
}

const app = css`
	text-align: center;
`

const appLogo = css`
	height: 40vmin;
	pointer-events: none;

	@media (prefers-reduced-motion: no-preference) {
		animation: App-logo-spin infinite 20s linear;
	}

	@keyframes App-logo-spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
`

const appHeader = css`
	background-color: #282c34;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: white;
`

const appLink = css`
	color: #61dafb;
`
