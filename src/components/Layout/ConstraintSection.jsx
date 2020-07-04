import React from 'react'
import { Machine } from 'xstate'

import { ServiceContext, useMachineBus } from '../../machineBus'
import { CheckboxPopup } from '../Constraints/CheckboxPopup'
import { Constraint } from '../Constraints/Constraint'
import { DATA_VIZ_COLORS } from '../DataViz/dataVizColors'
import { QueryController } from '../QueryController/QueryController'

const constraintMocks = [
	['Intermine List', 'IL'],
	['Symbol', 'Sy'],
	['Organism', 'Or'],
	['Pathway Name', 'PN'],
	['GO Annotation', 'GA'],
	['Expression', 'Ex'],
	['Interactions', 'In'],
]

const mockCheckboxMachine = Machine({
	id: 'mockmachine',
	initial: 'noConstraintsSet',
	context: {
		selectedValues: [],
		availableValues: [],
	},
	states: {
		noConstraintsSet: {},
		constraintsUpdated: {},
		constraintsApplied: {},
		constraintsLimitReached: {},
	},
})

const ConstraintBuilder = ({ name, label, color }) => {
	const [state, send] = useMachineBus(mockCheckboxMachine)

	return (
		<ServiceContext.Provider value={{ state, send }}>
			<Constraint constraintIconText={label} constraintName={name} labelBorderColor={color}>
				<CheckboxPopup
					title="No items found"
					description="If you feel this is a mistake, try refreshing the browser. If that doesn't work, let us know"
				/>
			</Constraint>
		</ServiceContext.Provider>
	)
}

export const ConstraintSection = () => {
	return (
		<section
			css={{
				minWidth: 230,
				borderRight: '2px solid var(--blue5)',
				backgroundColor: 'var(--solidWhite)',
			}}
		>
			<QueryController />
			<ul
				css={{
					overflow: 'auto',
					listStyle: 'none',
					padding: 0,
					height: '77vh',
				}}
			>
				{constraintMocks.map((c, idx) => (
					<li css={{ margin: '0.875em 0' }} key={idx}>
						<ConstraintBuilder name={c[0]} label={c[1]} color={DATA_VIZ_COLORS[idx]} />
					</li>
				))}
			</ul>
		</section>
	)
}
