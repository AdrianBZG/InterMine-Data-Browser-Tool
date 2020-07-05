import { Checkbox, Label } from '@blueprintjs/core'
import PropTypes from 'prop-types'
import React from 'react'

import { useServiceContext } from '../../machineBus'
import { ADD_CONSTRAINT, REMOVE_CONSTRAINT } from './actions'
import { NoValuesProvided } from './NoValuesProvided'

export const CheckboxPopup = ({ title = undefined, description = undefined }) => {
	const [state, send] = useServiceContext()

	const { availableValues, selectedValues } = state?.context

	if (availableValues.length === 0) {
		return <NoValuesProvided title={title} description={description} />
	}

	const onChangeHandler = (constraint) => (e) => {
		if (e.target.checked) {
			// @ts-ignore
			send({ type: ADD_CONSTRAINT, constraint })
		} else {
			// @ts-ignore
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
						// @ts-ignore
						onChange={onChangeHandler(value.item)}
					/>
				)
			})}
		</div>
	)
}

CheckboxPopup.propTypes = {
	checkAll: PropTypes.bool,
	disableAll: PropTypes.bool,
}
