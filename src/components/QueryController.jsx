import { Button, H5, Popover } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import React from 'react'

const ViewAll = () => (
	<Popover fill={true} usePortal={true} lazy={true} position="right">
		<Button text="view all" intent="primary" fill={true} icon={IconNames.EYE_OPEN} />
		<div style={{ height: 100 }}>Hey ma, Look! A popup!</div>
	</Popover>
)

const RunQuery = () => (
	<Popover
		css={{ marginTop: 40 }}
		wrapperTagName="div"
		usePortal={true}
		lazy={true}
		position="right"
	>
		<Button text="Run Query" intent="success" rightIcon={IconNames.PLAY} />
		<div style={{ height: 100 }}>Hey ma, Look! A popup!</div>
	</Popover>
)

export const QueryController = () => {
	return (
		<div css={{ paddingTop: 10, margin: '0 20px' }}>
			<H5>
				<span css={{ color: 'var(--red6' }}>4 </span>
				<span css={{ color: 'var(--yellow8)' }}>Constraints applied</span>
			</H5>
			<ViewAll />
			<RunQuery />
		</div>
	)
}
