import { Colors } from '@blueprintjs/core'
import React from 'react'

import { ConstraintBase } from './ConstraintBase'

export const PathwayName = () => (
	<ConstraintBase
		constraintName="Pathway Name"
		labelText="PN"
		labelBorderColor={Colors.INDIGO1}
		constraintCount={0}
	>
		<div style={{ height: '100px' }}>{'Look ma, a popover!'}</div>
	</ConstraintBase>
)
