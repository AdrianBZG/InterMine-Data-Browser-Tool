// import so that the IDE can add the css prop to components
import '@emotion/core'

import { assign } from '@xstate/immer'
import { enableMapSet } from 'immer'
import React, { useEffect } from 'react'
import {
	CHANGE_CLASS,
	CHANGE_CONSTRAINT_VIEW,
	CHANGE_MINE,
	FETCH_INITIAL_SUMMARY,
	TOGGLE_CATEGORY_VISIBILITY,
	TOGGLE_VIEW_IS_LOADING,
	UPDATE_TEMPLATE_QUERIES,
} from 'src/actionConstants'
import { fetchClasses, fetchInstances } from 'src/fetchSummary'
import { AppManagerServiceContext, sendToBus, useMachineBus } from 'src/machineBus'
import { forwardTo, Machine } from 'xstate'

import { ConstraintSection } from './Layout/ConstraintSection'
import { ChartSection, TableSection } from './Layout/DataVizSection'
import { Header } from './Layout/Header'
import { templateViewMachine } from './templateViewMachine'

enableMapSet()

// Todo: Change this after fixing biotestmine dev environment
const isProduction = true

/** @type {import('../types').ConstraintConfig[]} */
const defaultQueries = [
	{
		type: 'checkbox',
		name: 'Organism',
		label: 'Or',
		path: 'organism.shortName',
		op: 'ONE OF',
		valuesQuery: {
			select: ['primaryIdentifier'],
			model: {
				name: 'genomic',
			},
			where: [],
		},
	},
	{
		type: 'select',
		name: 'Pathway Name',
		label: 'Pn',
		path: 'pathways.name',
		op: 'ONE OF',
		valuesQuery: {
			select: ['pathways.name', 'primaryIdentifier'],
			model: {
				name: 'genomic',
			},
			orderBy: [
				{
					path: 'pathways.name',
					direction: 'ASC',
				},
			],
		},
	},
	{
		type: 'select',
		name: 'GO Annotation',
		label: 'GA',
		path: 'goAnnotation.ontologyTerm.name',
		op: 'ONE OF',
		valuesQuery: {
			select: ['goAnnotation.ontologyTerm.name', 'primaryIdentifier'],
			model: {
				name: 'genomic',
			},
			orderBy: [
				{
					path: 'Gene.goAnnotation.ontologyTerm.name',
					direction: 'ASC',
				},
			],
		},
	},
]

const appManagerMachine = Machine(
	{
		id: 'AppManager',
		initial: 'loading',
		context: {
			appView: 'defaultView',
			classView: 'Gene',
			intermines: [],
			modelClasses: [],
			showAllLabel: 'Show All',
			possibleQueries: defaultQueries,
			categories: {},
			viewIsLoading: false,
			selectedMine: {
				name: isProduction ? 'HumanMine' : 'biotestmine',
				rootUrl: isProduction
					? 'https://www.humanmine.org/humanmine'
					: 'http://localhost:9999/biotestmine',
			},
		},
		on: {
			[CHANGE_MINE]: { target: 'loading', actions: 'changeMine' },
			[CHANGE_CLASS]: { actions: ['changeClass'] },
			[UPDATE_TEMPLATE_QUERIES]: { actions: 'updateTemplateQueries' },
			[TOGGLE_VIEW_IS_LOADING]: { actions: 'toggleViewIsLoading' },
			[TOGGLE_CATEGORY_VISIBILITY]: { actions: 'forwardToTemplateView' },
			[CHANGE_CONSTRAINT_VIEW]: [
				{ target: 'defaultView', cond: 'isDefaultView' },
				{ target: 'templateView', cond: 'isTemplateView' },
				{ target: 'invalidAppView' },
			],
		},
		states: {
			loading: {
				on: {
					[CHANGE_CLASS]: { actions: 'changeClass' },
				},
				invoke: {
					id: 'fetchMines',
					src: 'fetchMinesAndClasses',
					onDone: {
						target: 'defaultView',
						actions: 'setIntermines',
					},
					onError: {
						target: 'defaultView',
						actions: (ctx, event) =>
							console.error('FETCH: could not retrieve intermines', { ctx, event }),
					},
				},
			},
			defaultView: {
				entry: ['setBrowserView', 'setPossibleOverviewQueries'],
				on: {
					[CHANGE_CLASS]: { actions: 'changeClass' },
				},
			},
			templateView: {
				entry: ['setTemplateView', 'clearPossibleQueries'],
				on: {
					[CHANGE_CLASS]: { actions: ['changeClass', 'forwardToTemplateView'] },
				},
				invoke: {
					id: 'templateView',
					src: templateViewMachine,
					data: {
						// Hack until xstate v5 introduces shallow merging
						...templateViewMachine.context,
						classView: (ctx) => ctx.classView,
						showAllLabel: (ctx) => ctx.showAllLabel,
						rootUrl: (ctx) => ctx.selectedMine.rootUrl,
					},
				},
			},
			invalidAppView: {},
		},
	},
	{
		actions: {
			forwardToTemplateView: forwardTo('templateView'),
			// @ts-ignore
			toggleViewIsLoading: assign((ctx, { isLoading }) => {
				ctx.viewIsLoading = isLoading
			}),
			// @ts-ignore
			updateTemplateQueries: assign((ctx, { queries, categories }) => {
				ctx.possibleQueries = queries
				ctx.categories = categories
			}),
			setTemplateView: assign((ctx) => {
				ctx.appView = 'templateView'
			}),
			clearPossibleQueries: assign((ctx) => {
				ctx.possibleQueries = []
			}),
			setPossibleOverviewQueries: assign((ctx) => {
				ctx.possibleQueries = defaultQueries
			}),
			setBrowserView: assign((ctx) => {
				ctx.appView = 'defaultView'
			}),
			// @ts-ignore
			changeMine: assign((ctx, { newMine }) => {
				ctx.selectedMine = ctx.intermines.find((mine) => mine.name === newMine)
				// set it back to default
				ctx.classView = 'Gene'
			}),
			// @ts-ignore
			changeClass: assign((ctx, { newClass }) => {
				ctx.classView = newClass
			}),
			// @ts-ignore
			setIntermines: assign((ctx, { data }) => {
				ctx.intermines = data.intermines
				ctx.modelClasses = data.modelClasses
					.sort()
					.map((cl) => ({ displayName: cl.displayName, name: cl.name }))
			}),
		},
		guards: {
			// @ts-ignore
			isDefaultView: (_, { newTabId }) => {
				return newTabId === 'defaultView'
			},
			// @ts-ignore
			isTemplateView: (_, { newTabId }) => {
				return newTabId === 'templateView'
			},
			// @ts-ignore
			showAllCategories: (ctx, { tagName }) => {
				return tagName === ctx.showAllLabel
			},
		},
		services: {
			fetchMinesAndClasses: async (ctx) => {
				let instances
				let modelClasses

				if (ctx.intermines.length === 0) {
					const [instancesResult, classesResult] = await Promise.all([
						fetchInstances(),
						fetchClasses(ctx.selectedMine.rootUrl),
					])

					instances = instancesResult
					modelClasses = classesResult
				} else {
					modelClasses = await fetchClasses(ctx.selectedMine.rootUrl)
				}

				return {
					modelClasses: Object.entries(modelClasses.classes).map(([_key, value]) => value),
					intermines:
						ctx.intermines.length > 0
							? ctx.intermines
							: instances.data.instances.map((mine) => ({
									name: mine.name,
									rootUrl: mine.url,
							  })),
				}
			},
		},
	}
)

export const App = () => {
	const [state, send] = useMachineBus(appManagerMachine)

	const {
		appView,
		classView,
		possibleQueries,
		categories,
		selectedMine,
		showAllLabel,
		viewIsLoading,
	} = state.context

	const rootUrl = selectedMine.rootUrl

	useEffect(() => {
		if (state.matches('defaultView')) {
			sendToBus({ type: FETCH_INITIAL_SUMMARY, globalConfig: { rootUrl, classView } })
		}
	}, [rootUrl, classView, state])

	const toggleCategory = ({ isVisible, tagName }) => {
		send({ type: TOGGLE_CATEGORY_VISIBILITY, isVisible, tagName })
	}

	return (
		<div className="light-theme">
			<AppManagerServiceContext.Provider value={{ state, send }}>
				<Header />
			</AppManagerServiceContext.Provider>
			<main
				css={{
					display: 'grid',
					gridTemplateColumns: '230px 1fr',
				}}
			>
				<ConstraintSection
					queries={possibleQueries}
					view={appView}
					classCategoryTags={Object.values(categories)}
					isLoading={viewIsLoading}
					toggleCategory={toggleCategory}
					showAllLabel={showAllLabel}
					classView={classView}
					rootUrl={rootUrl}
					showAll={categories[showAllLabel]?.isVisible ?? true}
				/>
				<section
					css={{
						padding: '10px 30px 0',
						overflow: 'auto',
						height: 'calc(100vh - 3.643em)',
					}}
				>
					<ChartSection />
					<TableSection />
				</section>
			</main>
		</div>
	)
}
