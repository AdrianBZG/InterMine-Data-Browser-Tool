import { Colors } from '@blueprintjs/core'
import React from 'react'

import { ConstraintBase } from './ConstraintBase'

export const Diseases = () => (
	<ConstraintBase
		constraintName="Diseases (OMIM)"
		labelText="Di"
		labelBorderColor={Colors.LIME2}
		constraintCount={0}
	>
		<div style={{ height: '100px' }}>{'Look ma, a popover!'}</div>
	</ConstraintBase>
)
