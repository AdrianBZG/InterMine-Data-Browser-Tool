import { Button, ButtonGroup, Classes, Divider, H5, Icon } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { useMachine, useService } from '@xstate/react'
import React, { useEffect, useRef } from 'react'
import { buildSearchIndex } from 'src/buildSearchIndex'
import { isMultiSelection, isSingleSelection } from 'src/constraintOperations'
import {
	FETCH_TEMPLATE_CONSTRAINT_ITEMS,
	FETCH_TEMPLATE_SUMMARY,
	RESET_OVERVIEW_CONSTRAINT,
} from 'src/eventConstants'
import { ConstraintServiceContext, useEventBus } from 'src/useEventBus'

import { CODES } from '../common'
import { InfoIconPopover } from '../Shared/InfoIconPopover'
import { PopupCard } from '../Shared/PopupCard'
import { InputWidget } from '../Widgets/InputWidget'
import { SelectWidget } from '../Widgets/SelectWidget'
import { SuggestWidget } from '../Widgets/SuggestWidget'
import { templateQueryMachine } from './templateQueryMachine'

const ConstraintWidget = ({ templateConstraintActor, mineName }) => {
	const [state, send, service] = useService(templateConstraintActor)
	useEventBus(service)

	const searchIndex = useRef(null)
	const { availableValues, name, rootUrl, constraint } = state.context
	const docField = 'value'

	useEffect(() => {
		send({ type: FETCH_TEMPLATE_CONSTRAINT_ITEMS })
	}, [send])

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

	let ConstraintWidget = InputWidget

	if (isSingleSelection.includes(constraint.op)) {
		ConstraintWidget = SelectWidget
	}

	if (isMultiSelection.includes(constraint.op)) {
		// @ts-ignore
		ConstraintWidget = SuggestWidget
	}

	return (
		<ConstraintServiceContext.Provider value={{ state, send }}>
			<div css={{ margin: '20px 0' }}>
				<H5>{name}</H5>
				<ConstraintWidget
					// @ts-ignore
					nonIdealTitle="No items found"
					nonIdealDescription="If you feel this is a mistake, try refreshing the browser. If that doesn't work, let us know"
					// @ts-ignore
					searchIndex={searchIndex}
					docField={docField}
					operationLabel={constraint.op}
				/>
			</div>
		</ConstraintServiceContext.Provider>
	)
}

export const TemplateQuery = ({ classView, template, rootUrl, mineName }) => {
	// Some tempalates do not have a `where` constraints array
	if (!template.where) {
		template.where = []
	}

	const editableConstraints = template.where.filter((con) => con.editable)

	const [state, , service] = useMachine(
		templateQueryMachine.withContext({
			...templateQueryMachine.context,
			classView,
			rootUrl,
			template,
			baseTemplate: template,
			isActiveQuery: false,
			constraints: editableConstraints,
		})
	)

	const [sendToBus] = useEventBus(service)

	const {
		isActiveQuery,
		listConstraint,
		template: updatedTemplate,
		constraintActors,
	} = state.context

	const showDivider = (idx) =>
		editableConstraints.length > 1 && idx < editableConstraints.length - 1

	let query = {
		...updatedTemplate,
		constraintLogic: template.where.map((_, idx) => CODES[idx]).join(' AND '),
		where: updatedTemplate.where,
	}

	if (listConstraint.value.length > 0) {
		const nextCode = CODES[updatedTemplate.where.length]
		query.constraintLogic = `${query.constraintLogic} AND ${nextCode}`
		query.where = [
			...query.where,
			{
				...listConstraint,
				path: classView,
				code: nextCode,
			},
		]
	}

	const disableRunQuery = constraintActors.some((actor) => {
		return actor.state.matches('noValuesSelected')
	})

	return (
		<PopupCard boundary="viewport">
			<div css={{ display: 'flex', alignItems: 'center' }}>
				<Button
					text={template.title}
					fill={true}
					alignText="left"
					minimal={true}
					// @ts-ignore
					icon={<InfoIconPopover title={template.title} description={template?.description} />}
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
			<ButtonGroup fill={true} css={{ justifyContent: 'center' }}>
				<Button
					text="Run Query"
					intent={disableRunQuery ? 'none' : 'success'}
					css={{ maxWidth: '50%' }}
					className={Classes.POPOVER_DISMISS}
					disabled={disableRunQuery}
					onClick={() => {
						sendToBus({
							query,
							classView,
							rootUrl,
							type: FETCH_TEMPLATE_SUMMARY,
						})
					}}
				/>
				<Button
					text="Reset All"
					intent="danger"
					css={{ maxWidth: '50%' }}
					onClick={() => {
						constraintActors.forEach((actor) => {
							actor.send({ type: RESET_OVERVIEW_CONSTRAINT })
						})
					}}
				/>
			</ButtonGroup>
		</PopupCard>
	)
}
