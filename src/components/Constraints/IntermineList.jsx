import { Colors } from '@blueprintjs/core'
import React from 'react'

import { ConstraintBase } from './ConstraintBase'

export const IntermineList = ({ constraintCount }) => (
	<ConstraintBase
		constraintName="Intermine List"
		labelText="IL"
		labelBorderColor={Colors.COBALT4}
		constraintCount={constraintCount}
	>
		<div style={{ height: '100px' }}>{'Look ma, a popover!'}</div>
	</ConstraintBase>
)
