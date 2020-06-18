import { addParameters } from '@storybook/react'
import 'normalize.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import { FocusStyleManager } from '@blueprintjs/core'

FocusStyleManager.onlyShowFocusOnTabs()

addParameters({
	options: {
		showRoots: true,
	},
})
