import { Colors } from '@blueprintjs/core'
import React from 'react'

import { ConstraintBase } from './ConstraintBase'

// add constraint to name because `Symbol` is a native keyword
export const SymbolConstraint = ({ constraintCount }) => (
	<ConstraintBase
		constraintName="Symbol"
		labelText="Sy"
		labelBorderColor={Colors.ROSE4}
		constraintCount={constraintCount}
	>
		<div style={{ height: '100px' }}>{'Look ma, a popover!'}</div>
	</ConstraintBase>
)
