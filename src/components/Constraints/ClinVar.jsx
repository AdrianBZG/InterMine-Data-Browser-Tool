import { Colors } from '@blueprintjs/core'
import React from 'react'

import { ConstraintBase } from './ConstraintBase'

export const ClinVar = () => (
	<ConstraintBase
		constraintName="ClinVar"
		labelText="CV"
		labelBorderColor={Colors.SEPIA4}
		constraintCount={0}
	>
		<div style={{ height: '100px' }}>{'Look ma, a popover!'}</div>
	</ConstraintBase>
)
