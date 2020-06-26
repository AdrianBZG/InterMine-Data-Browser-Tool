import { Button, Icon, Popover } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { styled } from 'linaria/react'
import PropTypes from 'prop-types'
import React from 'react'

const S_CountTag = styled.div`
	display: flex;
	align-self: flex-start;
	margin-left: 5px;
	font-size: var(--fs-desktopS1);
	font-weight: var(--fw-medium);
	line-height: 1;
	border: 2px solid var(--green5);
	border-radius: 10px;
	height: 1.333em;

	& > small {
		margin: 0 0.833em;
	}
`

const S_TagIcon = styled(Icon)`
	/* We need to override Blueprint styling to create our pill */
	margin: -0.167em -0.167em !important;
	align-self: flex-start;
`

const S_ConstraintLabel = styled.div`
	display: flex;
	align-items: center;
`

const S_ConstraintIcon = styled.div`
	border-radius: 30px;
	border: ${(props) => `0.167em solid ${props.labelBorderColor}`};
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
 *
 * ***NB***: The constraint stories are **not** styled to match their container's width, to
 * allow viewing their respective popups.
 */
export const Constraint = ({
	constraintName,
	labelBorderColor,
	constraintCount,
	ariaLabel,
	labelText,
}) => {
	return (
		<Button
			minimal={true}
			large={true}
			fill={true}
			alignText="left"
			aria-label={ariaLabel ? ariaLabel : constraintName}
		>
			<S_ConstraintLabel>
				<S_ConstraintIcon labelBorderColor={labelBorderColor}>
					<span>{labelText}</span>
				</S_ConstraintIcon>
				{constraintName}
				{constraintCount > 0 && (
					<S_CountTag>
						{constraintCount > 1 && <small>{constraintCount}</small>}
						<S_TagIcon icon={IconNames.TICK_CIRCLE} color="var(--green5)" />
					</S_CountTag>
				)}
			</S_ConstraintLabel>
		</Button>
	)
}

export const ConstraintBase = ({ children, ...constraintProps }) => (
	<Popover fill={true} usePortal={false} lazy={true} position="right" boundary="viewport">
		<Constraint {...constraintProps} />
		{children}
	</Popover>
)

const propTypes = {
	/**
	 * Name of the constraint
	 */
	constraintName: PropTypes.string,
	/**
	 * Text for the label icon
	 */
	labelText: PropTypes.string,
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
	popoverContent: PropTypes.node,
}

const defaultProps = {
	labelBorderColor: 'black',
	constraintCount: 0,
}

Constraint.propTypes = propTypes
Constraint.defaultProps = defaultProps

ConstraintBase.propTypes = propTypes
ConstraintBase.defaultProps = defaultProps
