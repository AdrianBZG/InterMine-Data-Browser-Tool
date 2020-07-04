import { Button, Divider, H4, H5, NonIdealState, Popover } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import { DELETE_QUERY_CONSTRAINT } from '../../actionConstants'
import { useMachineBus } from '../../machineBus'
import { NonIdealStateWarning } from '../Shared/NonIdealStates'
import { PopupCard } from '../Shared/PopupCard'
import { queryControllerMachine } from './queryControllerMachine'

const CurrentConstraints = ({ currentConstraints, sendMsg }) => {
	const [constraints, setConstraints] = useState(currentConstraints)

	useEffect(() => {
		if (currentConstraints !== constraints) {
			setConstraints(currentConstraints)
		}
	}, [currentConstraints, constraints])

	if (currentConstraints.length === 0) {
		return (
			<NonIdealStateWarning
				title="No Constraints applied"
				description="Displaying default results for the current mine"
			/>
		)
	}

	return (
		<ul css={{ padding: '0 16px', listStyle: 'none' }}>
			{constraints.map((constraint) => {
				return (
					<li
						key={constraint}
						css={{
							display: 'flex',
							alignItems: 'center',
							padding: '6px 0',
						}}
					>
						<Button
							intent="danger"
							icon={IconNames.REMOVE}
							small={true}
							minimal={true}
							onClick={() => sendMsg({ type: DELETE_QUERY_CONSTRAINT, constraint })}
							aria-label={`reset constraint ${constraint.replace(/\./g, ' ')}`}
							css={{ marginRight: 4 }}
						/>
						<span css={{ fontSize: 'var(--fs-desktopM1)', display: 'inline-block' }}>
							{constraint}
						</span>
					</li>
				)
			})}
		</ul>
	)
}

CurrentConstraints.propTypes = {
	currentConstraints: PropTypes.array,
	sendMsg: PropTypes.func,
}

CurrentConstraints.defaultProps = {
	currentConstraints: [],
}

export const ViewAllPopup = ({ currentConstraints, sendMsg }) => {
	return (
		<>
			<H4>Current</H4>
			<CurrentConstraints currentConstraints={currentConstraints} sendMsg={sendMsg} />
			<Divider css={{ width: '75%', marginBottom: 16 }} />
			<H4>History</H4>
			<NonIdealState
				title="You have no historical queries"
				icon={IconNames.INFO_SIGN}
				css={{
					paddingBottom: 32,
					borderRadius: 3,
				}}
			/>
		</>
	)
}

ViewAllPopup.propTypes = {
	currentConstraints: PropTypes.array,
	sendMsg: PropTypes.func,
}

ViewAllPopup.defaultProps = {
	currentConstraints: [],
}

const RunQuery = () => {
	return (
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
}

export const QueryController = () => {
	const [
		{
			context: { currentConstraints },
		},
		send,
	] = useMachineBus(queryControllerMachine)

	return (
		<div css={{ paddingTop: 10, margin: '0 20px' }}>
			<H5>
				<span css={{ color: 'var(--green5)' }}>4 </span>
				<span css={{ color: 'var(--blue9)' }}>Constraints applied</span>
			</H5>
			<PopupCard>
				<Button text="view all" intent="primary" fill={true} icon={IconNames.EYE_OPEN} />
				<ViewAllPopup currentConstraints={currentConstraints} sendMsg={send} />
			</PopupCard>
			<RunQuery />
		</div>
	)
}
