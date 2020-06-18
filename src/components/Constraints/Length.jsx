import { Colors } from '@blueprintjs/core'
import React from 'react'

import { ConstraintBase } from './ConstraintBase'

export const Length = () => (
	<ConstraintBase
		constraintName="Length"
		labelText="Le"
		labelBorderColor={Colors.INDIGO3}
		constraintCount={0}
	>
		<div style={{ height: '100px' }}>{'Look ma, a popover!'}</div>
	</ConstraintBase>
)
