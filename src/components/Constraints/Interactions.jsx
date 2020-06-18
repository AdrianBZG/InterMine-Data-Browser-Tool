import { Colors } from '@blueprintjs/core'
import React from 'react'

import { ConstraintBase } from './ConstraintBase'

export const Interactions = () => (
	<ConstraintBase
		constraintName="Interactions"
		labelText="In"
		labelBorderColor={Colors.VIOLET1}
		constraintCount={0}
	>
		<div style={{ height: '100px' }}>{'Look ma, a popover!'}</div>
	</ConstraintBase>
)
