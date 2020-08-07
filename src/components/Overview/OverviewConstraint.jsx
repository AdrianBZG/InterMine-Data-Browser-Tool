import { Button, ButtonGroup, Icon } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import styled from '@emotion/styled'
import { useService } from '@xstate/react'
import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'
import { buildSearchIndex } from 'src/buildSearchIndex'
import { APPLY_OVERVIEW_CONSTRAINT, RESET_OVERVIEW_CONSTRAINT } from 'src/eventConstants'
import { ConstraintServiceContext, useEventBus } from 'src/useEventBus'

import { ConstraintSetTag } from '../Shared/ConstraintSetTag'
import { PopupCard } from '../Shared/PopupCard'
import { CheckboxWidget } from '../Widgets/CheckboxWidget'
import { SuggestWidget } from '../Widgets/SuggestWidget'

const ConstraintCard = ({ children, disableAllButtons, enableApplyButton, handleOnClick }) => {
	const constraintApplied = !disableAllButtons && !enableApplyButton

	return (
		<>
			<div css={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
				<ConstraintSetTag constraintApplied={constraintApplied} text="Constraint Set" />
			</div>
			{children}
			<ButtonGroup fill={true} css={{ marginTop: 48 }}>
				<Button
					text="Reset Constraint"
					css={{ maxWidth: '50%' }}
					intent={!disableAllButtons && constraintApplied ? 'danger' : 'none'}
					disabled={disableAllButtons || !constraintApplied}
					onClick={() => handleOnClick(RESET_OVERVIEW_CONSTRAINT)}
				/>
				<Button
					text="Apply Constraint"
					css={{ maxWidth: '50%' }}
					intent={!disableAllButtons && enableApplyButton ? 'success' : 'none'}
					disabled={disableAllButtons || !enableApplyButton}
					onClick={() => handleOnClick(APPLY_OVERVIEW_CONSTRAINT)}
				/>
			</ButtonGroup>
		</>
	)
}

const ConstraintButton = ({ label, color, name, constraintCount, isUpdated }) => {
	return (
		<Button minimal={true} large={true} fill={true} alignText="left" aria-label={name}>
			<div css={{ display: 'flex', alignItems: 'center' }}>
				{/**@ts-ignore **/}
				<S_ConstraintIcon labelBorderColor={color}>
					<span>{label}</span>
				</S_ConstraintIcon>
				{name}
				{constraintCount > 0 && (
					// @ts-ignore
					<S_CountTag isUpdated={isUpdated}>
						{constraintCount > 1 && <small>{constraintCount}</small>}
						<Icon
							css={{ margin: '-0.167em -0.167em !important', alignSelf: 'flex-start' }}
							icon={IconNames.TICK_CIRCLE}
							color={isUpdated ? 'var(--yellow5)' : 'var(--green5)'}
						/>
					</S_CountTag>
				)}
			</div>
		</Button>
	)
}

ConstraintCard.propTypes = {
	/**
	 * Whether the contrainst is set
	 */
	constraintSet: PropTypes.bool,
}

const S_CountTag = styled.div`
	display: flex;
	align-self: flex-start;
	margin-left: 5px;
	font-size: var(--fs-desktopS1);
	font-weight: var(--fw-medium);
	line-height: 1;
	border: ${({
		// @ts-ignore
		isUpdated,
	}) => (isUpdated ? '2px solid var(--yellow5)' : '2px solid var(--green5)')};
	border-radius: 10px;
	height: 1.333em;

	& > small {
		margin: 0 0.833em;
	}
`

const S_ConstraintIcon = styled.div`
	border-radius: 30px;
	border: ${(props) =>
		`0.167em solid ${
			// @ts-ignore
			props.labelBorderColor
		}`};
	font-size: var(--fs-desktopS1);
	font-weight: var(--fw-medium);
	height: 2.5em;
	line-height: 1;
	margin-right: 0.625em;
	width: 2.5em;
	display: flex;
	align-items: center;
	justify-content: center;
`

export const OverviewConstraint = ({ color, overviewConstraintActor }) => {
	const [state, send, service] = useService(overviewConstraintActor)
	useEventBus(service)

	const { availableValues, selectedValues, type, constraintItemsQuery, label, name } = state.context
	const constraintCount = selectedValues.length

	const searchIndex = useRef(null)
	const docField = 'item'

	useEffect(() => {
		const buildIndex = async () => {
			if (type === 'select' && searchIndex.current === null && availableValues.length > 0) {
				searchIndex.current = await buildSearchIndex({
					docField,
					docId: 'item',
					values: availableValues,
					query: {
						...constraintItemsQuery,
						name: `${name}-constraint`,
					},
				})
			}
		}

		buildIndex()
	}, [availableValues, constraintItemsQuery, name, type])

	let ConstraintWidget

	switch (type) {
		case 'checkbox':
			ConstraintWidget = CheckboxWidget
			break
		default:
			ConstraintWidget = SuggestWidget
			break
	}

	const disableAllButtons =
		state.matches('noConstraintsSet') ||
		state.matches('loading') ||
		state.matches('noConstraintItems')

	const enableApplyButton = state.matches('constraintsUpdated')

	/**
	 * This is used to decide the color for the count tag. Since it will only
	 * ever be displayed when a constraint is actually set, we only care to know if
	 * it has been updated so we can change its color.
	 */
	const isUpdated = state.matches('constraintsUpdated')

	const handleOnClick = (type) => send({ type })

	return (
		<ConstraintServiceContext.Provider value={{ state, send }}>
			<PopupCard boundary="viewport">
				<ConstraintButton
					label={label}
					color={color}
					name={name}
					constraintCount={constraintCount}
					isUpdated={isUpdated}
				/>
				<div>
					<ConstraintCard
						disableAllButtons={disableAllButtons}
						enableApplyButton={enableApplyButton}
						handleOnClick={handleOnClick}
					>
						<ConstraintWidget
							nonIdealTitle="No items found"
							nonIdealDescription="If you feel this is a mistake, try refreshing the browser. If that doesn't work, let us know"
							// @ts-ignore
							searchIndex={searchIndex}
							docField={docField}
						/>
					</ConstraintCard>
				</div>
			</PopupCard>
		</ConstraintServiceContext.Provider>
	)
}
