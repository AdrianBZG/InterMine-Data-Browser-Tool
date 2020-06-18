import { Colors } from '@blueprintjs/core'
import React from 'react'

import { ConstraintBase } from './ConstraintBase'

export const Identifiers = () => (
	<ConstraintBase
		constraintName="Identifiers"
		labelText="ID"
		labelBorderColor={Colors.VIOLET3}
		constraintCount={0}
	>
		<div style={{ height: '100px' }}>{'Look ma, a popover!'}</div>
	</ConstraintBase>
)
