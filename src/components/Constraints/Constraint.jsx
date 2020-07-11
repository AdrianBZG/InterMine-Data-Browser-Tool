import { Button, ButtonGroup, Icon, Tag } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import React from 'react'
import { APPLY_CONSTRAINT, RESET_LOCAL_CONSTRAINT } from 'src/actionConstants'

import { useServiceContext } from '../../machineBus'
import { PopupCard } from '../Shared/PopupCard'

export const ConstraintPopupCard = ({ children }) => {
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
					onClick={() => send(APPLY_CONSTRAINT)}
				/>
			</ButtonGroup>
		</>
	)
}

ConstraintPopupCard.propTypes = {
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
/**
 * A constraint is styled as a button that takes the full width of its container. Each
 * constraint manages its own internal state with a state machine, and syncs back to the
 * history component using the event bus.
 */
export const Constraint = ({
	children = null,
	constraintName,
	labelBorderColor = 'black',
	ariaLabel = '',
	constraintIconText,
}) => {
	const [state] = useServiceContext('constraints')

	const constraintCount = state.context.selectedValues.length

	/**
	 * This is used to decide the color for the count tag. Since it will only
	 * ever be displayed when a constraint is actually set, we only care to know if
	 * it has been updated so we can change its color.
	 */
	const isUpdated = state.matches('constraintsUpdated')

	return (
		<PopupCard boundary="viewport">
			<Button
				minimal={true}
				large={true}
				fill={true}
				alignText="left"
				aria-label={ariaLabel ? ariaLabel : constraintName}
			>
				<div css={{ display: 'flex', alignItems: 'center' }}>
					<S_ConstraintIcon
						// @ts-ignore
						labelBorderColor={labelBorderColor}
					>
						<span>{constraintIconText}</span>
					</S_ConstraintIcon>
					{constraintName}
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
				<ConstraintPopupCard>{children}</ConstraintPopupCard>
			</div>
		</PopupCard>
	)
}

const propTypes = {
	/**
	 * Name of the constraint
	 */
	constraintName: PropTypes.string,
	/**
	 * Text for the label icon
	 */
	constraintIconTExt: PropTypes.string,
	/**
	 * Label icon border color
	 */
	labelBorderColor: PropTypes.string,
	/**
	 * The number of constraints applied
	 */
	constraintCount: PropTypes.number,
	/**
	 * The text to be read by a screenreader
	 */
	ariaLabel: PropTypes.string,
}

Constraint.propTypes = propTypes
