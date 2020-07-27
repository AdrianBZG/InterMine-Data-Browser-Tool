import { Button, Divider, H4, H5, NonIdealState } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import PropTypes from 'prop-types'
import React from 'react'
import { DELETE_QUERY_CONSTRAINT, FETCH_UPDATED_SUMMARY } from 'src/eventConstants'
import { QueryServiceContext, sendToBus, useMachineBus, useServiceContext } from 'src/machineBus'

import { RunQueryButton } from '../Shared/Buttons'
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
								onClick={() => send({ type: DELETE_QUERY_CONSTRAINT, path: constraintConfig.path })}
								aria-label={`reset constraint ${constraintConfig.path.replace(/\./g, ' ')}`}
								css={{ marginRight: 4 }}
							/>
							<span css={{ fontSize: 'var(--fs-desktopM1)', display: 'inline-block' }}>
								{constraintConfig.path}
							</span>
						</div>
						<ul css={{ listStyle: 'none', paddingLeft: 36 }}>
							{constraintConfig.valuesDescription.map((value) => {
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

// Storybook export
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

const CODES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export const QueryController = () => {
	const [state, send] = useMachineBus(queryControllerMachine)

	const { currentConstraints, classView, selectedPaths, rootUrl, appView } = state.context

	let color = 'var(--green5)'

	if (currentConstraints.length === 26) {
		color = 'var(--red5)'
	} else if (currentConstraints.length > 14) {
		color = 'var(--yellow5)'
	}

	const runQuery = () => {
		let constraintLogic = ''

		const codedConstraints = currentConstraints.map((con, idx) => {
			const code = CODES[idx]
			constraintLogic = constraintLogic === '' ? `(${code})` : `${constraintLogic} AND (${code})`

			return {
				...con,
				code,
			}
		})

		const query = {
			from: classView,
			select: selectedPaths,
			constraintLogic,
			where: codedConstraints,
		}

		sendToBus({ type: FETCH_UPDATED_SUMMARY, query, globalConfig: { classView, rootUrl } })
	}

	const BrowserConstraintViewAll = () => (
		<>
			<H5>
				<span
					css={{ color, display: 'inline-block', marginRight: 4 }}
				>{`${currentConstraints.length}`}</span>
				<span css={{ color: 'var(--blue9)' }}>Constraints applied</span>
			</H5>
			<PopupCard>
				<Button text="view all" intent="primary" fill={true} icon={IconNames.EYE_OPEN} />
				<QueryServiceContext.Provider value={{ state, send }}>
					<ViewAllPopup />
				</QueryServiceContext.Provider>
			</PopupCard>
		</>
	)

	return (
		<div css={{ paddingTop: 10, margin: '0 20px' }}>
			{appView === 'defaultView' && <BrowserConstraintViewAll />}
			<RunQueryButton
				intent={currentConstraints.length === 0 ? 'none' : 'success'}
				isDisabled={currentConstraints.length === 0}
				handleOnClick={runQuery}
			/>
		</div>
	)
}
