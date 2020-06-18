import { Colors } from '@blueprintjs/core'
import React from 'react'

import { ConstraintBase } from './ConstraintBase'

export const DatasetName = () => (
	<ConstraintBase
		constraintName="Dataset Name"
		labelText="DN"
		labelBorderColor={Colors.ROSE1}
		constraintCount={0}
	>
		<div style={{ height: '100px' }}>{'Look ma, a popover!'}</div>
	</ConstraintBase>
)
