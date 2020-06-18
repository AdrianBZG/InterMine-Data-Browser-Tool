import { Colors } from '@blueprintjs/core'
import React from 'react'

import { ConstraintBase } from './ConstraintBase'

export const Name = () => (
	<ConstraintBase
		constraintName="Name"
		labelText="Na"
		labelBorderColor={Colors.VERMILION5}
		constraintCount={0}
	>
		<div style={{ height: '100px' }}>{'Look ma, a popover!'}</div>
	</ConstraintBase>
)
