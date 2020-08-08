import { InputGroup } from '@blueprintjs/core'
import React from 'react'
import { ADD_CONSTRAINT } from 'src/eventConstants'
import { usePartialContext } from 'src/useEventBus'

export const InputWidget = ({ operationLabel }) => {
	const [state, sendToConstraintMachine] = usePartialContext('constraints', (ctx) => ({
		selectedValues: ctx.selectedValues,
	}))

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
				value={state.selectedValues[0]}
				onChange={(e) =>
					sendToConstraintMachine({ type: ADD_CONSTRAINT, constraint: e.target.value })
				}
			/>
		</div>
	)
}
