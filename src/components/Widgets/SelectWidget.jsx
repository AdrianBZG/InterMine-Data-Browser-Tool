import { Button, Classes, FormGroup, MenuItem } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import React, { useState } from 'react'
import { operationsDict } from 'src/constraintOperations'
import { ADD_CONSTRAINT } from 'src/eventConstants'
import { generateId } from 'src/generateId'
import { usePartialContext } from 'src/useEventBus'

const renderItems = (item, { handleClick, modifiers }) => {
	if (!modifiers.matchesPredicate) {
		return null
	}

	return (
		<MenuItem active={modifiers.active} key={item.value} onClick={handleClick} text={item.value} />
	)
}

export const SelectWidget = () => {
	const [uniqueId] = useState(() => `selectWidget-${generateId()}`)
	const [state, sendToConstraintMachine] = usePartialContext('constraints', (ctx) => ({
		availableValues: ctx.availableValues,
		constraint: ctx.constraint,
		selectedValues: ctx.selectedValues,
	}))

	const { availableValues, constraint, selectedValues } = state

	const handleItemSelect = ({ value }) => {
		sendToConstraintMachine({ type: ADD_CONSTRAINT, constraint: value })
	}

	return (
		<FormGroup css={{ [`& .${Classes.FORM_CONTENT}`]: { display: 'flex' } }}>
			<div
				css={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					marginRight: 5,
					border: '1px solid var(--grey3)',
					borderRadius: 3,
					minWidth: 28,
					height: 30,
				}}
			>
				{operationsDict[constraint.op]}
			</div>
			<Select
				// @ts-ignore
				id={uniqueId}
				filterable={false}
				items={availableValues}
				itemRenderer={renderItems}
				onItemSelect={handleItemSelect}
				itemPredicate={(q, item) => item}
				popoverProps={{ captureDismiss: true }}
				noResults="No items available"
			>
				<Button text={selectedValues[0]} rightIcon={IconNames.CARET_DOWN} />
			</Select>
		</FormGroup>
	)
}
