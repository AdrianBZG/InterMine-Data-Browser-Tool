import { InputGroup } from '@blueprintjs/core'
import React from 'react'
import { ADD_CONSTRAINT } from 'src/eventConstants'
import { useServiceContext } from 'src/useEventBus'

export const InputWidget = ({ operationLabel }) => {
	const [state, send] = useServiceContext('constraints')

	const { selectedValues } = state.context

	return (
		<div css={{ display: 'flex' }}>
			<div
				css={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					marginRight: 5,
					border: '1px solid var(--grey3)',
					borderRadius: 3,
					width: 100,
					height: 30,
				}}
			>
				{operationLabel}
			</div>
			<InputGroup
				fill={true}
				value={selectedValues[0]}
				onChange={(e) => send({ type: ADD_CONSTRAINT, constraint: e.target.value })}
			/>
		</div>
	)
}
