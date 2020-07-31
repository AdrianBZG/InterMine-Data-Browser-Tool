import { Tag, Text } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import React from 'react'

export const ConstraintSetTag = ({ constraintApplied, text, ellipsize = false }) => {
	const borderColor = constraintApplied ? 'var(--blue4)' : 'var(--grey4)'
	const iconColor = constraintApplied ? 'var(--green5)' : 'var(--grey4)'
	const textColor = constraintApplied ? 'var(--blue9)' : 'var(--grey4)'

	return (
		<Tag
			css={{
				backgroundColor: 'unset',
				border: `1px solid ${borderColor}`,
				color: iconColor,
				maxWidth: 120,
			}}
			// @ts-ignore
			intent="" // HACK - decreases blueprintjs css specificity
			icon={constraintApplied ? IconNames.TICK_CIRCLE : IconNames.DISABLE}
			minimal={true}
		>
			<Text
				// @ts-ignore
				css={{ color: textColor, fontWeight: 'var(--fw-medium)' }}
				ellipsize={ellipsize}
				tagName="span"
			>
				{text}
			</Text>
		</Tag>
	)
}
