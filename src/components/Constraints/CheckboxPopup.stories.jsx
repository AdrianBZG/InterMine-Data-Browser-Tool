import React from 'react'

import { ServiceContext, useMachineBus } from '../../machineBus'
import { organismSummary } from '../../stubs/geneSummaries'
import { popupDecorator } from '../../utils/storybook'
import { CheckboxPopup } from './CheckboxPopup'
import { constraintMachineFactory } from './common'
import { ConstraintPopupCard } from './Constraint'
import { machineStub } from './utils'

export default {
	title: 'Components/Popup Cards/CheckBox',
	decorators: [...popupDecorator],
}

const CheckboxBuilder = ({
	initialState = '',
	selectedValues = [],
	availableValues = organismSummary.results,
	machine = null,
}) => {
	const [state, send] = useMachineBus(
		machine ? machine : machineStub(initialState, availableValues, selectedValues)
	)

	return (
		<div css={{ maxWidth: 500, minWidth: 376 }}>
			<ServiceContext.Provider value={{ state, send }}>
				<ConstraintPopupCard>
					<CheckboxPopup />
				</ConstraintPopupCard>
			</ServiceContext.Provider>
		</div>
	)
}

export const NoValuesFound = () => (
	<CheckboxBuilder initialState="noConstraintsSet" availableValues={[]} />
)

export const ConstraintNotSet = () => (
	<CheckboxBuilder initialState="noConstraintsSet" selectedValues={[]} />
)

export const ConstraintsChanged = () => (
	<CheckboxBuilder
		initialState="constraintsUpdated"
		selectedValues={['M. musculus', 'H. sapiens']}
	/>
)

export const ConstraintsApplied = () => (
	<CheckboxBuilder
		initialState="constraintsApplied"
		selectedValues={['H. sapiens', 'C. elegans']}
	/>
)

export const Playground = () => {
	const machine = constraintMachineFactory({ id: 'checkbox' }).withContext({
		selectedValues: [],
		availableValues: organismSummary.results,
	})

	return <CheckboxBuilder machine={machine} />
}
