import { MenuItem } from '@blueprintjs/core'
import React from 'react'

export const NumberedSelectMenuItems = (item, props) => {
	return (
		<MenuItem
			key={item.name}
			text={`${props.index + 1}. ${item.name}`}
			active={props.modifiers.active}
			onClick={props.handleClick}
		/>
	)
}
