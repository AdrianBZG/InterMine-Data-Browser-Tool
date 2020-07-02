import { Card } from '@blueprintjs/core'
import React from 'react'

import * as Controller from './QueryController/QueryController'

export default {
	title: 'Components/Popup Cards/ViewAll',
	decorators: [(storyFn) => <Card css={{ maxWidth: 500 }}>{storyFn()}</Card>],
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
			'Gene.organism.shortName = M. musculus',
			'Gene.organism.shortName = H. sapiens',
			'Gene LOOKUP MGI:1918911',
		]}
	/>
)

WithConstraints.parameters = {
	docs: {
		storyDescription: 'State with constraints applied',
	},
}
