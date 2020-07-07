import React from 'react'

import { MockMachineContext } from '../../machineBus'
import { QueryController as QCont } from './QueryController'
import { queryControllerMachine } from './queryControllerMachine'

export default {
	title: 'Components/QueryController',
	parameters: {
		componentSubtitle: 'The QueryController executes queries and maintains the history',
	},
}

const machine = queryControllerMachine.withContext({
	currentConstraints: [
		{
			path: 'organism.shortname',
			op: 'ONE OF',
			values: ['M. musculus', 'H. sapiens', 'R. rerio'],
		},
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
			css={{
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
