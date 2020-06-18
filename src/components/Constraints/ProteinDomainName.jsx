import { Colors } from '@blueprintjs/core'
import React from 'react'

import { ConstraintBase } from './ConstraintBase'

export const ProteinDomainName = () => (
	<ConstraintBase
		constraintName="Protein Domain Name"
		labelText="PD"
		labelBorderColor={Colors.TURQUOISE3}
		constraintCount={0}
	>
		<div style={{ height: '100px' }}>{'Look ma, a popover!'}</div>
	</ConstraintBase>
)
