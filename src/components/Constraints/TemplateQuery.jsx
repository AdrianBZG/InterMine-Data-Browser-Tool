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
import { assign } from '@xstate/immer'
import React, { useEffect, useRef } from 'react'
import {
	ADD_CONSTRAINT,
	ADD_TEMPLATE_CONSTRAINT,
	FETCH_UPDATED_SUMMARY,
	REMOVE_CONSTRAINT,
	TEMPLATE_CONSTRAINT_UPDATED,
} from 'src/actionConstants'
import { buildSearchIndex } from 'src/buildSearchIndex'
import { fetchPathValues } from 'src/fetchSummary'
import { ConstraintServiceContext, sendToBus, useMachineBus } from 'src/machineBus'
import { Machine } from 'xstate'

import { RunQueryButton } from '../Shared/Buttons'
import { PopupCard } from '../Shared/PopupCard'
import { CheckboxPopup } from './CheckboxPopup'
import { SelectPopup } from './SelectPopup'

const templateConstraintMachine = Machine(
	{
		id: 'Template constraint',
		initial: 'loading',
		context: {
			rootUrl: '',
			path: '',
			op: '',
			selectedValues: [],
			availableValues: [],
		},
		states: {
			loading: {
				invoke: {
					id: 'fetchTemplateConstraintValues',
					src: 'fetchConstraintValues',
					onDone: {
						target: 'idle',
						actions: 'setAvailableValues',
					},
					onError: {
						target: 'noValuesForConstraint',
						actions: 'logErrorToConsole',
					},
				},
			},
			noValuesForConstraint: {},
			idle: {
				on: {
					[ADD_CONSTRAINT]: { target: 'updateTemplateQuery', actions: 'addConstraint' },
					[REMOVE_CONSTRAINT]: { target: 'updateTemplateQuery', actions: 'removeConstraint' },
				},
			},
			updateTemplateQuery: {
				entry: 'updateTemplateQuery',
				on: {
					[TEMPLATE_CONSTRAINT_UPDATED]: { target: 'idle', cond: 'constraintUpdated' },
				},
			},
			// delay the finished transition to avoid quick flashes of animations
			pending: {
				after: {
					500: [{ target: 'idle', cond: 'hasValues' }, { target: 'noValuesForConstraint' }],
				},
			},
		},
	},
	{
		actions: {
			// @ts-ignore
			logErrorToConsole: (_, event) => console.warn(event.data),
			// @ts-ignore
			addConstraint: assign((ctx, { constraint }) => {
				if (ctx.op === 'ONE OF') {
					ctx.selectedValues.push(constraint)
				} else {
					ctx.selectedValues = [constraint]
				}
			}),
			// @ts-ignore
			removeConstraint: assign((ctx, { constraint }) => {
				ctx.selectedValues = ctx.selectedValues.filter((name) => name !== constraint)
			}),
			// @ts-ignore
			setAvailableValues: assign((ctx, { data }) => {
				const { values } = data
				ctx.availableValues = values.map((val) => ({ ...val, item: val.value }))
			}),
			updateTemplateQuery: (ctx) => {
				sendToBus({
					type: ADD_TEMPLATE_CONSTRAINT,
					path: ctx.path,
					selectedValues: ctx.selectedValues,
				})
			},
		},
		guards: {
			// @ts-ignore
			constraintUpdated: (ctx, { path }) => {
				return ctx.path === path
			},
			hasValues: (ctx) => {
				return ctx.availableValues.length > 0
			},
		},
		services: {
			fetchConstraintValues: async (ctx) => {
				const values = await fetchPathValues({ rootUrl: ctx.rootUrl, path: ctx.path })

				return {
					values,
				}
			},
		},
	}
)

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
		availableValues.length <= 10 && constraint.op === 'ONE OF' ? CheckboxPopup : SelectPopup

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

const templateQueryMachine = Machine(
	{
		id: 'Template query machine',
		initial: 'idle',
		context: {
			template: null,
			isActiveQuery: false,
		},
		states: {
			idle: {
				on: {
					[ADD_TEMPLATE_CONSTRAINT]: { actions: 'setQueries', cond: 'templateHasQuery' },
					[FETCH_UPDATED_SUMMARY]: { actions: 'setActiveQuery' },
				},
			},
		},
	},
	{
		actions: {
			// @ts-ignore
			setQueries: assign((ctx, { path, selectedValues }) => {
				const query = ctx.template.where.find((con) => con.path === path)
				if ('value' in query) {
					query.value = selectedValues[0]
				} else {
					query.values = selectedValues
				}

				sendToBus({ type: TEMPLATE_CONSTRAINT_UPDATED, path })
			}),
			// @ts-ignore
			setActiveQuery: assign((ctx, { query }) => {
				ctx.isActiveQuery = query.name === ctx.template.name
			}),
		},
		guards: {
			// @ts-ignore
			templateHasQuery: (ctx, { path }) => {
				return ctx.template.where.some((con) => con.path === path)
			},
		},
	}
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
