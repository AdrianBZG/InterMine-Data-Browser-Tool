import { css } from 'linaria'
import React from 'react'

import logo from './logo.svg'

export const App = () => {
	return (
		<div className={app}>
			<header className={appHeader}>
				<img src={logo} className={appLogo} alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
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
	font-size: calc(10px + 2vmin);
	color: white;
`

const appLink = css`
	color: #61dafb;
`
