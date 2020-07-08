import { Checkbox, Label } from '@blueprintjs/core'
import React from 'react'
import { ADD_CONSTRAINT, REMOVE_CONSTRAINT } from 'src/actionConstants'

import { useServiceContext } from '../../machineBus'
import { NoValuesProvided } from './NoValuesProvided'

export const CheckboxPopup = ({ nonIdealTitle = undefined, nonIdealDescription = undefined }) => {
	const [state, send] = useServiceContext('constraints')

	const { availableValues, selectedValues } = state?.context

	if (availableValues.length === 0) {
		return <NoValuesProvided title={nonIdealTitle} description={nonIdealDescription} />
	}

	const onChangeHandler = (constraint) => (e) => {
		if (e.target.checked) {
			send({ type: ADD_CONSTRAINT, constraint })
		} else {
			send({ type: REMOVE_CONSTRAINT, constraint })
		}
	}

	return (
		<div>
			<Label className="sr-only">Select organisms to set constraints</Label>
			{availableValues.map((value) => {
				return (
					<Checkbox
						key={value.item}
						label={`${value.item} (${value.count})`}
						checked={selectedValues.some((name) => name === value.item)}
						onChange={onChangeHandler(value.item)}
					/>
				)
			})}
		</div>
	)
}
