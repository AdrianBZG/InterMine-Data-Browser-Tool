import React from 'react'

import { ConstraintServiceContext, useMachineBus } from '../../machineBus'
import { CheckboxPopup } from './CheckboxPopup'
import { Constraint } from './Constraint'
import { createConstraintMachine } from './createConstraintMachine'

export default {
	title: 'Components/Constraint',
	decorators: [(storyFn) => <div style={{ marginTop: 20, maxWidth: '320px' }}>{storyFn()}</div>],
}

export const Example = () => {
	const [state, send] = useMachineBus(
		createConstraintMachine({ id: 'checkbox', constraintItemsQuery: {} })
	)

	return (
		<ConstraintServiceContext.Provider value={{ state, send }}>
			<Constraint constraintName="Organism" constraintIconText="Or">
				<CheckboxPopup
					nonIdealTitle="No organisms found"
					nonIdealDescription="If you feel this is a mistake, try refreshing the browser. If that doesn't work, let us know"
				/>
			</Constraint>
		</ConstraintServiceContext.Provider>
	)
}
