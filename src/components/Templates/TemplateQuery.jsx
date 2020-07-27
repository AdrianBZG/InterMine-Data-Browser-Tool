import {
	Button,
	Classes,
	Divider,
	H5,
	Icon,
	Popover,
	PopoverInteractionKind,
	Text,
} from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import React, { useEffect, useRef } from 'react'
import { buildSearchIndex } from 'src/buildSearchIndex'
import { FETCH_UPDATED_SUMMARY } from 'src/eventConstants'
import { ConstraintServiceContext, sendToBus, useMachineBus } from 'src/machineBus'

import { RunQueryButton } from '../Shared/Buttons'
import { PopupCard } from '../Shared/PopupCard'
import { CheckboxWidget } from '../Widgets/CheckboxWidget'
import { SuggestWidget } from '../Widgets/SuggestWidget'
import { templateConstraintMachine } from './templateConstraintMachine'
import { templateQueryMachine } from './templateQueryMachine'

const ConstraintWidget = ({ constraint, rootUrl }) => {
	const [state, send] = useMachineBus(
		templateConstraintMachine.withContext({
			rootUrl,
			path: constraint.path,
			op: constraint.op,
			selectedValues: [],
			availableValues: [],
		})
	)

	const searchIndex = useRef(null)
	const { availableValues } = state.context

	const name = constraint.path.split('.').join(' > ')

	useEffect(() => {
		const buildIndex = async () => {
			if (searchIndex.current === null && availableValues.length > 0) {
				searchIndex.current = await buildSearchIndex({
					docId: 'item',
					docField: 'item',
					values: availableValues,
				})
			}
		}

		buildIndex()
	}, [availableValues])

	const Widget =
		availableValues.length <= 10 && constraint.op === 'ONE OF' ? CheckboxWidget : SuggestWidget

	return (
		<ConstraintServiceContext.Provider value={{ state, send }}>
			<div css={{ margin: '20px 0' }}>
				<H5>{name}</H5>
				<Widget
					nonIdealTitle="No items found"
					nonIdealDescription="If you feel this is a mistake, try refreshing the browser. If that doesn't work, let us know"
					// @ts-ignore
					searchIndex={searchIndex.current}
				/>
			</div>
		</ConstraintServiceContext.Provider>
	)
}

const InfoIcon = ({ description }) => (
	<Popover
		interactionKind={PopoverInteractionKind.HOVER_TARGET_ONLY}
		boundary="viewport"
		css={{ marginRight: 20, marginLeft: 5 }}
	>
		<Icon icon={IconNames.INFO_SIGN} color="var(--grey5)" iconSize={20} />
		<div css={{ maxWidth: 500, padding: 20 }}>
			<Text>{description ? description : 'No Description Provided'}</Text>
		</div>
	</Popover>
)

export const TemplateQuery = ({ classView, rootUrl, template }) => {
	// We don't provide default values for the templates
	const withNoDefaults = [...template.where].map((con) => {
		if ('value' in con) {
			return {
				...con,
				value: '',
			}
		}
		return { ...con, values: [] }
	})
	const editableConstraints = withNoDefaults.filter((con) => con.editable)

	const templateQuery = {
		...template,
		where: withNoDefaults,
	}

	const [state] = useMachineBus(
		templateQueryMachine.withContext({ template: templateQuery, isActiveQuery: false })
	)

	const { isActiveQuery } = state.context

	const showDivider = (idx) =>
		editableConstraints.length > 1 && idx < editableConstraints.length - 1

	return (
		<PopupCard boundary="viewport">
			<div css={{ display: 'flex', alignItems: 'center' }}>
				<Button
					text={template.title}
					fill={true}
					alignText="left"
					minimal={true}
					icon={<InfoIcon description={template?.description} />}
					rightIcon={
						isActiveQuery ? (
							<Icon icon={IconNames.TICK_CIRCLE} intent="success" iconSize={20} />
						) : null
					}
				/>
			</div>
			{editableConstraints.map((con, idx) => {
				return (
					<div key={con.path}>
						<ConstraintWidget constraint={con} rootUrl={rootUrl} />
						{showDivider(idx) && <Divider />}
					</div>
				)
			})}
			<div className={Classes.POPOVER_DISMISS}>
				<RunQueryButton
					handleOnClick={() => {
						sendToBus({
							type: FETCH_UPDATED_SUMMARY,
							query: state.context.template,
							globalConfig: { classView, rootUrl },
						})
					}}
				/>
			</div>
		</PopupCard>
	)
}
