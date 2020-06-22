import React from 'react'

import { QueryController as QCont } from './QueryController'

export default {
	component: QCont,
	title: 'Components/QueryController',
	parameters: {
		componentSubtitle: 'The QueryController maintains executes queries and maintains the history',
	},
	decorators: [
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
	],
}

export const QueryController = () => {
	return <QCont />
}
