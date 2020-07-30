import { Button, ButtonGroup, Icon, Tag } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'
import { buildSearchIndex } from 'src/buildSearchIndex'
import { APPLY_DATA_BROWSER_CONSTRAINT, RESET_LOCAL_CONSTRAINT } from 'src/eventConstants'
import { ConstraintServiceContext, useMachineBus, useServiceContext } from 'src/useMachineBus'

import { PopupCard } from '../Shared/PopupCard'
import { CheckboxWidget } from '../Widgets/CheckboxWidget'
import { SuggestWidget } from '../Widgets/SuggestWidget'
import { overviewConstraintMachine } from './overviewConstraintMachine'

const ConstraintCard = ({ children }) => {
	const [state, send] = useServiceContext('constraints')

	const disableAllButtons =
		state.matches('noConstraintsSet') ||
		state.matches('loading') ||
		state.matches('noConstraintItems')

	const enableAdd = state.matches('constraintsUpdated')
	const constraintApplied = !disableAllButtons && !enableAdd

	const borderColor = constraintApplied ? 'var(--blue4)' : 'var(--grey4)'
	const iconColor = constraintApplied ? 'var(--green5)' : 'var(--grey4)'
	const textColor = constraintApplied ? 'var(--blue9)' : 'var(--grey4)'

	return (
		<>
			<div css={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
				<Tag
					css={{
						backgroundColor: 'unset',
						border: `1px solid ${borderColor}`,
						color: iconColor,
					}}
					// @ts-ignore
					intent="" // HACK - decreases blueprintjs css specificity
					icon={constraintApplied ? IconNames.TICK_CIRCLE : IconNames.DISABLE}
					minimal={true}
				>
					<span
						// @ts-ignore
						css={{ color: textColor, fontWeight: 'var(--fw-medium)' }}
					>
						Constraint Set
					</span>
				</Tag>
			</div>
			{children}
			<ButtonGroup fill={true} css={{ marginTop: 48 }}>
				<Button
					text="Reset Constraint"
					css={{ maxWidth: '50%' }}
					intent={!disableAllButtons && constraintApplied ? 'danger' : 'none'}
					disabled={disableAllButtons || !constraintApplied}
					onClick={() => send(RESET_LOCAL_CONSTRAINT)}
				/>
				<Button
					text="Apply Constraint"
					css={{ maxWidth: '50%' }}
					intent={!disableAllButtons && enableAdd ? 'success' : 'none'}
					disabled={disableAllButtons || !enableAdd}
					onClick={() => send(APPLY_DATA_BROWSER_CONSTRAINT)}
				/>
			</ButtonGroup>
		</>
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

export const OverviewConstraint = ({ constraintConfig, color }) => {
	const { type, name, label, path, op, valuesQuery: constraintItemsQuery } = constraintConfig

	const [state, send] = useMachineBus(
		overviewConstraintMachine(`ConstraintMachine-${name}`).withContext({
			...overviewConstraintMachine().context,
			op,
			type,
			constraintPath: path,
			constraintItemsQuery,
		})
	)

	const constraintCount = state.context.selectedValues.length
	const searchIndex = useRef(null)
	const { availableValues } = state.context

	useEffect(() => {
		const buildIndex = async () => {
			if (type === 'select' && searchIndex.current === null && availableValues.length > 0) {
				searchIndex.current = await buildSearchIndex({
					docId: 'item',
					docField: 'item',
					values: availableValues,
				})
			}
		}

		buildIndex()
	}, [availableValues, type])

	let ConstraintWidget

	switch (type) {
		case 'checkbox':
			ConstraintWidget = CheckboxWidget
			break
		default:
			ConstraintWidget = SuggestWidget
			break
	}

	if (state.matches('noConstraintItems') || state.matches('loading')) {
		return null
	}

	/**
	 * This is used to decide the color for the count tag. Since it will only
	 * ever be displayed when a constraint is actually set, we only care to know if
	 * it has been updated so we can change its color.
	 */
	const isUpdated = state.matches('constraintsUpdated')

	return (
		<ConstraintServiceContext.Provider value={{ state, send }}>
			<PopupCard boundary="viewport">
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
				<div>
					<ConstraintCard>
						<ConstraintWidget
							nonIdealTitle="No items found"
							nonIdealDescription="If you feel this is a mistake, try refreshing the browser. If that doesn't work, let us know"
							// @ts-ignore
							searchIndex={searchIndex}
						/>
					</ConstraintCard>
				</div>
			</PopupCard>
		</ConstraintServiceContext.Provider>
	)
}
