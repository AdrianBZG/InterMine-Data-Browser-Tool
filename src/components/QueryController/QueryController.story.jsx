import React from 'react'

import { MockMachineContext } from '../../machineBus'
import { popupDecorator } from '../../utils/storybook'
import { QueryController as QCont, ViewAllPopup } from './QueryController'
import { queryControllerMachine } from './queryControllerMachine'

export default {
	title: 'Components/QueryController',
	parameters: {
		componentSubtitle: 'The QueryController executes queries and maintains the history',
	},
}

const machine = queryControllerMachine.withContext({
	currentConstraints: [
		'Gene.organism.shortName = M. musculus',
		'Gene.organism.shortName = H. sapiens',
		'Gene LOOKUP MGI:1918911',
	],
})

export const QueryController = () => {
	return (
		<MockMachineContext.Provider value={machine}>
			<QCont />
		</MockMachineContext.Provider>
	)
}

QueryController.decorators = [
	(storyFn) => (
		<div
			style={{
				maxWidth: '230px',
				padding: '0 20px',
				border: '1px solid black',
				height: '100vh',
			}}
		>
			{storyFn()}
		</div>
	),
]

export const ViewAllPopupEmpty = () => <ViewAllPopup />

ViewAllPopupEmpty.parameters = {
	docs: {
		storyDescription: 'View All pop up with non ideal state with no constraints applied',
	},
}

ViewAllPopupEmpty.decorators = popupDecorator

export const ViewAllPopupWithConstraints = () => (
	<ViewAllPopup
		currentConstraints={[
			'Gene.organism.shortName = M. musculus',
			'Gene.organism.shortName = H. sapiens',
			'Gene LOOKUP MGI:1918911',
		]}
	/>
)

ViewAllPopupWithConstraints.parameters = {
	docs: {
		storyDescription: 'State with constraints applied',
	},
}

ViewAllPopupWithConstraints.decorators = popupDecorator
