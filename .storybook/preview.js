import { addParameters, addDecorator } from '@storybook/react'
import 'normalize.css'
import '@blueprintjs/core/lib/css/blueprint.css'
import { FocusStyleManager } from '@blueprintjs/core'
import '../src/theme/main.css'
import { Global, css } from '@emotion/core'

FocusStyleManager.onlyShowFocusOnTabs()

addDecorator((storyFn) => (
	<div>
		<Global
			styles={css`
				div.sbdocs .sbdocs-content {
					max-width: 1000px;
				}
			`}
		/>
		{storyFn()}
	</div>
))

addParameters({
	options: {
		showRoots: true,
	},
})
