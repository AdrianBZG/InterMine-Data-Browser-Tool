import { Button, Colors, Icon } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import React, { useState } from 'react'

import { S_NavFormGroup } from './FormGroups'

const AuthenticatedIcon = (isAuthenticated) => (
	<Icon
		icon={isAuthenticated ? IconNames.UNLOCK : IconNames.LOCK}
		color={isAuthenticated ? Colors.GREEN5 : Colors.RED3}
	/>
)

export const ApiStatus = () => {
	const [isAuthenticated, setAuthentication] = useState(false)
	return (
		<S_NavFormGroup label="Api" inline={true} labelFor="api-status">
			<Button
				aria-label="api-status"
				small={true}
				icon={AuthenticatedIcon(isAuthenticated)}
				onClick={() => setAuthentication(!isAuthenticated)}
			/>
		</S_NavFormGroup>
	)
}
