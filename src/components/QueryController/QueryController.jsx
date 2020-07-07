import { Button, Divider, H4, H5, NonIdealState, Popover } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import PropTypes from 'prop-types'
import React from 'react'

import { DELETE_QUERY_CONSTRAINT } from '../../actionConstants'
import { QueryServiceContext, useMachineBus, useServiceContext } from '../../machineBus'
import { NonIdealStateWarning } from '../Shared/NonIdealStates'
import { PopupCard } from '../Shared/PopupCard'
import { queryControllerMachine } from './queryControllerMachine'

const getOperantSymbol = (operant) => {
	switch (operant) {
		case 'ONE OF':
			return '='
		default:
			return ''
	}
}

const CurrentConstraints = () => {
	const [state, send] = useServiceContext('queryController')

	const {
		context: { currentConstraints },
	} = state

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
			{currentConstraints.flatMap((constraintConfig) => {
				return (
					<li key={constraintConfig.path} css={{ alignItems: 'center', padding: '6px 0' }}>
						<div css={{ display: 'flex' }}>
							<Button
								intent="danger"
								icon={IconNames.REMOVE}
								small={true}
								minimal={true}
								onClick={() => send({ type: DELETE_QUERY_CONSTRAINT, query: constraintConfig })}
								aria-label={`reset constraint ${constraintConfig.path.replace(/\./g, ' ')}`}
								css={{ marginRight: 4 }}
							/>
							<span css={{ fontSize: 'var(--fs-desktopM1)', display: 'inline-block' }}>
								{constraintConfig.path}
							</span>
						</div>
						<ul css={{ listStyle: 'none', paddingLeft: 36 }}>
							{constraintConfig.itemDescription.map((value) => {
								return (
									<li key={value.item}>{`${getOperantSymbol(constraintConfig.op)} ${value.item} (${
										value.count
									})`}</li>
								)
							})}
						</ul>
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

export const ViewAllPopup = () => {
	return (
		<>
			<H4>Current</H4>
			<CurrentConstraints />
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
	const [state, send] = useMachineBus(queryControllerMachine)

	return (
		<div css={{ paddingTop: 10, margin: '0 20px' }}>
			<H5>
				<span css={{ color: 'var(--green5)' }}>4 </span>
				<span css={{ color: 'var(--blue9)' }}>Constraints applied</span>
			</H5>
			<PopupCard>
				<Button text="view all" intent="primary" fill={true} icon={IconNames.EYE_OPEN} />
				<QueryServiceContext.Provider value={{ state, send }}>
					<ViewAllPopup />
				</QueryServiceContext.Provider>
			</PopupCard>
			<RunQuery />
		</div>
	)
}
