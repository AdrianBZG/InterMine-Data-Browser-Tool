import { Colors } from '@blueprintjs/core'
import React from 'react'

import { ConstraintBase } from './ConstraintBase'

export const Phenotype = () => (
	<ConstraintBase
		constraintName="Phenotype"
		labelText="Ph"
		labelBorderColor={Colors.FOREST5}
		constraintCount={0}
	>
		<div style={{ height: '100px' }}>{'Look ma, a popover!'}</div>
	</ConstraintBase>
)
