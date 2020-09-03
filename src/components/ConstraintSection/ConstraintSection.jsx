import { Button, Classes, Collapse, Divider, Tab, Tabs, Tag } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { useService } from '@xstate/react'
import React, { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'
// use direct import because babel is not properly changing it in webpack
import { useFirstMountState } from 'react-use/lib/useFirstMountState'
import {
	RESET_PLOTS,
	TOGGLE_CATEGORY_VISIBILITY,
	TOGGLE_VIEW,
	UPDATE_OVERVIEW_PLOTS,
	UPDATE_TEMPLATE_PLOTS,
} from 'src/eventConstants'
import { sendToBus, useEventBus } from 'src/useEventBus'

import { DATA_VIZ_COLORS } from '../dataVizColors'
import { OverviewConstraint } from '../Overview/OverviewConstraint'
import { QueryController } from '../QueryController/QueryController'
import { NonIdealStateWarning } from '../Shared/NonIdealStates'
import { TemplateQuery } from '../Templates/TemplateQuery'

const ShowCategories = ({ categoryTagsForClass, handleCategoryToggle, showAll, showAllLabel }) => {
	const [showCategories, setShowCategories] = useState(false)

	return (
		<>
			<Button
				icon={showCategories ? IconNames.CARET_DOWN : IconNames.CARET_RIGHT}
				fill={true}
				alignText="left"
				text="Select Categories"
				minimal={true}
				large={true}
				onClick={() => setShowCategories(!showCategories)}
			/>
			<Collapse isOpen={showCategories} css={{ marginTop: 0 }}>
				<div css={{ backgroundColor: 'var(--blue0)', padding: 10 }}>
					{categoryTagsForClass.map(({ tagName, isVisible, count }) => {
						if (count === 0 && tagName !== showAllLabel) {
							return null
						}

						let isEnabled = false
						if (showAll) {
							isEnabled = tagName === showAllLabel
						} else {
							isEnabled = isVisible
						}

						return (
							<Tag
								key={tagName}
								intent="primary"
								interactive={true}
								onClick={() => handleCategoryToggle({ isVisible: !isVisible, tagName })}
								minimal={!isEnabled || count === 0}
								css={{ margin: 4 }}
							>
								{`${tagName} ${count ?? 0}`}
							</Tag>
						)
					})}
				</div>
			</Collapse>
		</>
	)
}

const TemplatesList = ({
	templateViewActor,
	setShowAllLabel,
	setCategories,
	setCategoryTagsForClass,
}) => {
	const { height } = useWindowSize()

	const [state, , service] = useService(templateViewActor)
	const {
		classView,
		rootUrl,
		showAllLabel,
		categories,
		mineName,
		templatesForSelectedCategories,
		categoryTagsForClass,
		lastTemplateQuery,
	} = state.context

	const { isLoading } = state.activities

	const [sendToBus] = useEventBus(service)
	const isFirstMount = useFirstMountState()

	useEffect(() => {
		if (isFirstMount) {
			sendToBus({ type: RESET_PLOTS })
			sendToBus({ type: UPDATE_TEMPLATE_PLOTS, query: lastTemplateQuery, classView, rootUrl })
		}
	})

	useEffect(() => {
		setShowAllLabel(showAllLabel)
	}, [setShowAllLabel, showAllLabel])

	useEffect(() => {
		setCategories(categories)
	}, [categories, setCategories])

	useEffect(() => {
		setCategoryTagsForClass(categoryTagsForClass)
	}, [categoryTagsForClass, setCategoryTagsForClass])

	return (
		<ul css={{ overflow: 'auto', listStyle: 'none', padding: 0, maxHeight: height - 173 }}>
			{!isLoading &&
				templatesForSelectedCategories.map((template) => (
					<li key={template.name} css={{ margin: '0.875em 0' }}>
						<TemplateQuery
							classView={classView}
							rootUrl={rootUrl}
							template={template}
							mineName={mineName}
						/>
					</li>
				))}
		</ul>
	)
}

const Templates = ({ templateViewActor }) => {
	const [showAllLabel, setShowAllLabel] = useState('')
	const [categories, setCategories] = useState({})
	const [categoryTagsForClass, setCategoryTagsForClass] = useState([])
	const [sendToBus] = useEventBus()

	const showAll = categories[showAllLabel]?.isVisible ?? true

	const handleCategoryToggle = ({ isVisible, tagName }) => {
		// @ts-ignore
		sendToBus({ type: TOGGLE_CATEGORY_VISIBILITY, isVisible, tagName })
	}

	return (
		<div>
			<Divider css={{ margin: 0 }} />
			<ShowCategories
				handleCategoryToggle={handleCategoryToggle}
				categoryTagsForClass={categoryTagsForClass}
				showAllLabel={showAllLabel}
				showAll={showAll}
			/>
			<Divider css={{ margin: 0 }} />
			{templateViewActor && (
				<TemplatesList
					templateViewActor={templateViewActor}
					setShowAllLabel={setShowAllLabel}
					setCategories={setCategories}
					setCategoryTagsForClass={setCategoryTagsForClass}
				/>
			)}
		</div>
	)
}

const OverviewConstraintList = ({ overviewActor }) => {
	const { height } = useWindowSize()

	const [state, , service] = useService(overviewActor)
	useEventBus(service)
	const isFirstMount = useFirstMountState()

	const { constraintActors, lastOverviewQuery, classView, rootUrl } = state.context

	useEffect(() => {
		if (isFirstMount) {
			sendToBus({ type: RESET_PLOTS })
			sendToBus({ type: UPDATE_OVERVIEW_PLOTS, query: lastOverviewQuery, classView, rootUrl })
		}
	})

	const hasNoConstraints = constraintActors.every((actor) => {
		return actor.state.activities.hidingConstraintFromView
	})

	if (hasNoConstraints) {
		return (
			<NonIdealStateWarning
				title="No Constraints available"
				description="The selected class does not provide constraints to edit"
				isWarning={false}
				styles={{ display: 'block', paddingTop: 100 }}
			/>
		)
	}

	return (
		<ul
			css={{
				overflow: 'auto',
				listStyle: 'none',
				padding: 0,
				maxHeight: height - 173,
			}}
		>
			{constraintActors.map((actor, idx) => {
				return (
					<li css={{ margin: '0.875em 0' }} key={actor.id}>
						<OverviewConstraint
							overviewConstraintActor={actor}
							color={DATA_VIZ_COLORS[idx % DATA_VIZ_COLORS.length]}
						/>
					</li>
				)
			})}
		</ul>
	)
}

export const ConstraintSection = ({
	templateViewActor,
	overviewActor,
	queryControllerActor,
	appView,
}) => {
	const isTemplateView = appView === 'templateView'
	const [sendToBus] = useEventBus()

	return (
		<section
			css={{
				minWidth: 230,
				borderRight: '2px solid var(--blue5)',
				backgroundColor: 'var(--solidWhite)',
			}}
		>
			<Tabs
				id="constraint-tabs"
				selectedTabId={appView}
				large={true}
				// @ts-ignore
				onChange={(newTabId) => {
					sendToBus({ type: TOGGLE_VIEW, newTabId })
				}}
				css={{
					marginBottom: 10,
					[`&& .${Classes.TAB_LIST}`]: { margin: '10px 20px 0' },
				}}
			>
				<Tab id="defaultView" title="Overview" />
				<Tab id="templateView" title="Templates" />
			</Tabs>
			{isTemplateView ? (
				<Templates templateViewActor={templateViewActor} />
			) : (
				<>
					{queryControllerActor && <QueryController queryControllerActor={queryControllerActor} />}
					{overviewActor && <OverviewConstraintList overviewActor={overviewActor} />}
				</>
			)}
		</section>
	)
}
