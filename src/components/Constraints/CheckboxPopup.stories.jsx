import React from 'react'

import { ConstraintServiceContext, useMachineBus } from '../../machineBus'
import { organismSummary } from '../../stubs/geneSummaries'
import { popupDecorator } from '../../utils/storybook'
import { CheckboxPopup } from './CheckboxPopup'
import { ConstraintPopupCard } from './Constraint'
import { createConstraintMachine } from './createConstraintMachine'
import { machineStub } from './utils'

export default {
	title: 'Components/Popup Cards/CheckBox',
	decorators: [...popupDecorator],
}

/**
 * @param {{
 * 	initialState?: import('../../types').ConstraintMachineFactoryOpts['initial'],
 * 	selectedValues?: string[],
 * 	availableValues?: any[],
 * 	machine?: import('../../types').ConstraintStateMachine
 * }} props
 */
const CheckboxBuilder = ({
	initialState,
	selectedValues = [],
	availableValues = organismSummary.results,
	machine = undefined,
}) => {
	const [state, send] = useMachineBus(
		machine ? machine : machineStub(initialState, availableValues, selectedValues)
	)

	return (
		<div css={{ maxWidth: 500, minWidth: 376 }}>
			<ConstraintServiceContext.Provider value={{ state, send }}>
				<ConstraintPopupCard>
					<CheckboxPopup />
				</ConstraintPopupCard>
			</ConstraintServiceContext.Provider>
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
	const machine = createConstraintMachine({ id: 'checkbox' }).withContext({
		selectedValues: [],
		availableValues: organismSummary.results,
		constraintPath: '',
	})

	return <CheckboxBuilder machine={machine} />
}
