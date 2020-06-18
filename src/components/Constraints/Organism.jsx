import { Colors } from '@blueprintjs/core'
import React from 'react'

import { ConstraintBase } from './ConstraintBase'

export const Organism = () => (
	<ConstraintBase
		constraintName="Organism"
		labelText="Or"
		labelBorderColor={Colors.ROSE4}
		constraintCount={0}
	>
		<div style={{ height: '100px' }}>{'Look ma, a popover!'}</div>
	</ConstraintBase>
)
