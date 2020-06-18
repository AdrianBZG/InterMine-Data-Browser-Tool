import { Colors } from '@blueprintjs/core'
import React from 'react'

import { ConstraintBase } from './ConstraintBase'

export const Expression = () => (
	<ConstraintBase
		constraintName="Expression"
		labelText="Ex"
		labelBorderColor={Colors.BLUE5}
		constraintCount={0}
	>
		<div style={{ height: '100px' }}>{'Look ma, a popover!'}</div>
	</ConstraintBase>
)
