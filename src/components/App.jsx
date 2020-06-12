import { css, cx } from 'linaria'
import React from 'react'

import logo from '../images/logo.svg'
import { lightTheme } from '../theme'
import * as Text from './Text'

export const App = () => {
	return (
		<div className={cx(app, lightTheme)}>
			<header className={appHeader}>
				<img src={logo} className={appLogo} alt="logo" />
				<Text.Span fontSize={'large'}>Edit src/App.js and save to reload.</Text.Span>
				<a className={appLink} href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
					Learn React
				</a>
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
