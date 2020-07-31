import { Button, Classes, Divider, H5, Icon } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import React, { useEffect, useRef } from 'react'
import { buildSearchIndex } from 'src/buildSearchIndex'
import { FETCH_UPDATED_SUMMARY } from 'src/eventConstants'
import { ConstraintServiceContext, sendToBus, useMachineBus } from 'src/useMachineBus'

import { CODES, listConstraintQuery } from '../common'
import { RunQueryButton } from '../Shared/Buttons'
import { InfoIconPopover } from '../Shared/InfoIconPopover'
import { PopupCard } from '../Shared/PopupCard'
import { CheckboxWidget } from '../Widgets/CheckboxWidget'
import { SuggestWidget } from '../Widgets/SuggestWidget'
import { templateConstraintMachine } from './templateConstraintMachine'
import { templateQueryMachine } from './templateQueryMachine'

const ConstraintWidget = ({ constraint, rootUrl }) => {
	const name = constraint.path.split('.').join(' > ')

	const [state, send] = useMachineBus(
		templateConstraintMachine(`Template-${name} constraint widget`).withContext({
			rootUrl,
			path: constraint.path,
			op: constraint.op,
			selectedValues: [],
			availableValues: [],
		})
	)

	const searchIndex = useRef(null)
	const { availableValues } = state.context
	const docField = 'item'

	useEffect(() => {
		const buildIndex = async () => {
			if (searchIndex.current === null && availableValues.length > 0) {
				searchIndex.current = await buildSearchIndex({
					docField,
					docId: 'item',
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
					searchIndex={searchIndex}
					docField={docField}
				/>
			</div>
		</ConstraintServiceContext.Provider>
	)
}

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
		templateQueryMachine(`Template-${template.name} Query`).withContext({
			...templateQueryMachine().context,
			template: templateQuery,
			isActiveQuery: false,
		})
	)

	const { isActiveQuery, listNames, template: updatedTemplate } = state.context

	const showDivider = (idx) =>
		editableConstraints.length > 1 && idx < editableConstraints.length - 1

	const nextCode = CODES[updatedTemplate.where.length]
	const query = {
		...updatedTemplate,
		constraintLogic: `${updatedTemplate.constraintLogic} and ${nextCode}`,
		where: [
			...updatedTemplate.where,
			{
				...listConstraintQuery,
				path: classView,
				values: listNames,
				code: nextCode,
			},
		],
	}

	return (
		<PopupCard boundary="viewport">
			<div css={{ display: 'flex', alignItems: 'center' }}>
				<Button
					text={template.title}
					fill={true}
					alignText="left"
					minimal={true}
					// @ts-ignore
					icon={<InfoIconPopover description={template?.description} />}
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
							query,
							type: FETCH_UPDATED_SUMMARY,
							globalConfig: { classView, rootUrl },
						})
					}}
				/>
			</div>
		</PopupCard>
	)
}
