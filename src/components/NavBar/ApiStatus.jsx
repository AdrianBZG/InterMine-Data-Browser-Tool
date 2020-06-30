import { Button, Colors, Icon } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import React, { useState } from 'react'

const AuthenticatedIcon = (isAuthenticated) => (
	<Icon
		icon={isAuthenticated ? IconNames.UNLOCK : IconNames.LOCK}
		color={isAuthenticated ? Colors.GREEN5 : Colors.RED3}
	/>
)

export const ApiStatus = () => {
	const [isAuthenticated, setAuthentication] = useState(false)

	return (
		<div css={{ display: 'flex', alignItems: 'center' }}>
			<span
				// @ts-ignore
				css={{
					fontSize: 'var(--fs-desktopM2)',
					fontWeight: 'var(--fw-regular)',
					marginRight: 8,
					marginBottom: 0,
				}}
			>
				Api
			</span>
			<Button
				aria-label="api-status"
				small={true}
				icon={AuthenticatedIcon(isAuthenticated)}
				onClick={() => setAuthentication(!isAuthenticated)}
			/>
		</div>
	)
}
