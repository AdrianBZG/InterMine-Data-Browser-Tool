import React from 'react'

import { popupDecorator } from '../../utils/storybook'
import * as Controller from './QueryController'

export default {
	title: 'Components/Popup Cards/Query Controller',
	decorators: [...popupDecorator],
}

export const Default = () => <Controller.ViewAllPopup />

Default.parameters = {
	docs: {
		storyDescription: 'Non ideal state with no constraints applied',
	},
}

export const WithConstraints = () => (
	<Controller.ViewAllPopup
		currentConstraints={[
			{
				path: 'organism.shortname',
				op: 'ONE OF',
				values: ['M. musculus', 'H. sapiens', 'R. rerio'],
			},
		]}
	/>
)

WithConstraints.parameters = {
	docs: {
		storyDescription: 'State with constraints applied',
	},
}
