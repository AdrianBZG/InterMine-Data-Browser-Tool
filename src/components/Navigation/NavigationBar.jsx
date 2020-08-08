import { Button, Navbar } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import React from 'react'
import { RESET_OVERVIEW, RESET_TEMPLATE_VIEW } from 'src/eventConstants'
import { useEventBus, usePartialContext } from 'src/useEventBus'

import { ClassSelector } from './ClassSelector'
import { ListSelector } from './ListSelector'
import { MineSelector } from './MineSelector'

/**
 *
 */
export const NavigationBar = () => {
	const [state] = usePartialContext('appManager', (ctx) => ({
		appView: ctx.appView,
	}))

	const [sendToBus] = useEventBus()

	return (
		<Navbar css={{ padding: '0 40px' }}>
			<Navbar.Group css={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
				<MineSelector />
				<ClassSelector />
				<ListSelector />
				<Button
					text="Reset view"
					intent="danger"
					icon={IconNames.ERROR}
					css={{ marginLeft: 'auto' }}
					onClick={() => {
						sendToBus({
							type: state.appView === 'defaultView' ? RESET_OVERVIEW : RESET_TEMPLATE_VIEW,
						})
					}}
				/>
			</Navbar.Group>
		</Navbar>
	)
}
