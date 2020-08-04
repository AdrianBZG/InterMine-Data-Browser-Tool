import 'normalize.css'
import './theme/main.css'

import { FocusStyleManager } from '@blueprintjs/core'
import { css, Global } from '@emotion/core'
import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './components/App/App'
import * as serviceWorker from './serviceWorker'

FocusStyleManager.onlyShowFocusOnTabs()

ReactDOM.render(
	<>
		<Global
			styles={css`
				body {
					overflow: hidden;
				}
			`}
		/>
		<App />
	</>,
	document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
