import { Button, Classes, Divider, H5, Icon } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { useService } from '@xstate/react'
import React, { useEffect, useRef } from 'react'
import { buildSearchIndex } from 'src/buildSearchIndex'
import { FETCH_UPDATED_SUMMARY } from 'src/eventConstants'
import { ConstraintServiceContext, sendToBus, useMachineBus } from 'src/useMachineBus'

import { CODES } from '../common'
import { RunQueryButton } from '../Shared/Buttons'
import { InfoIconPopover } from '../Shared/InfoIconPopover'
import { PopupCard } from '../Shared/PopupCard'
import { SuggestWidget } from '../Widgets/SuggestWidget'
import { templateQueryMachine } from './templateQueryMachine'

const ConstraintWidget = ({ templateConstraintActor, mineName }) => {
	const [state, send] = useService(templateConstraintActor)

	const searchIndex = useRef(null)
	const { availableValues, name, rootUrl, constraint } = state.context
	const docField = 'value'

	useEffect(() => {
		const buildIndex = async () => {
			if (searchIndex.current === null && availableValues.length > 0) {
				searchIndex.current = await buildSearchIndex({
					docField,
					docId: 'value',
					values: availableValues,
					query: { rootUrl, mineName, constraint, name: `${name}-constraint` },
				})
			}
		}

		buildIndex()
	}, [availableValues, mineName, name, constraint, rootUrl])

	return (
		<ConstraintServiceContext.Provider value={{ state, send }}>
			<div css={{ margin: '20px 0' }}>
				<H5>{name}</H5>
				<SuggestWidget
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

export const TemplateQuery = ({ classView, rootUrl, template, mineName }) => {
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
		templateQueryMachine.withContext({
			...templateQueryMachine.context,
			rootUrl,
			template: templateQuery,
			isActiveQuery: false,
			constraints: editableConstraints,
		})
	)

	const {
		isActiveQuery,
		listConstraint,
		template: updatedTemplate,
		constraintActors,
	} = state.context

	const showDivider = (idx) =>
		editableConstraints.length > 1 && idx < editableConstraints.length - 1

	const query = {
		...updatedTemplate,
		constraintLogic: updatedTemplate.constraintLogic,
		where: updatedTemplate.where,
	}

	if (listConstraint.value.length > 0) {
		const nextCode = CODES[updatedTemplate.where.length]
		query.where = [
			...query.where,
			{
				...listConstraint,
				path: classView,
				code: nextCode,
			},
		]
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
			{constraintActors.map((actor, idx) => {
				return (
					<div key={actor.id}>
						<ConstraintWidget templateConstraintActor={actor} mineName={mineName} />
						{showDivider(idx) && <Divider />}
					</div>
				)
			})}
			<div className={Classes.POPOVER_DISMISS}>
				<RunQueryButton
					handleOnClick={() => {
						sendToBus({
							query,
							classView,
							rootUrl,
							type: FETCH_UPDATED_SUMMARY,
						})
					}}
				/>
			</div>
		</PopupCard>
	)
}
