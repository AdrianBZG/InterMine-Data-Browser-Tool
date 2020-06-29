import { Button, Colors, Icon } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { styled } from 'linaria/react'
import React, { useState } from 'react'

const S_ApiLabel = styled.span`
	font-size: var(--fs-desktopM2);
	font-weight: var(--fw-regular);
	margin-right: 8px;
	margin-bottom: 0;
`
const S_ApiContainer = styled.div`
	display: flex;
	align-items: center;
`

const AuthenticatedIcon = (isAuthenticated) => (
	<Icon
		icon={isAuthenticated ? IconNames.UNLOCK : IconNames.LOCK}
		color={isAuthenticated ? Colors.GREEN5 : Colors.RED3}
	/>
)

export const ApiStatus = () => {
	const [isAuthenticated, setAuthentication] = useState(false)

	return (
		<S_ApiContainer>
			<S_ApiLabel>Api</S_ApiLabel>
			<Button
				aria-label="api-status"
				small={true}
				icon={AuthenticatedIcon(isAuthenticated)}
				onClick={() => setAuthentication(!isAuthenticated)}
			/>
		</S_ApiContainer>
	)
}
