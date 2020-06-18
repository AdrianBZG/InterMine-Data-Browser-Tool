import { Colors } from '@blueprintjs/core'
import React from 'react'

import { ConstraintBase } from './ConstraintBase'

export const GOAnnotation = () => (
	<ConstraintBase
		constraintName="GO Annotation"
		labelText="GA"
		labelBorderColor={Colors.GOLD5}
		constraintCount={0}
	>
		<div style={{ height: '100px' }}>{'Look ma, a popover!'}</div>
	</ConstraintBase>
)
