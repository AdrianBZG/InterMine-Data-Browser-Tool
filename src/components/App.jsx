// import so that the IDE can add the css prop to components
import '@emotion/core'

import { assign } from '@xstate/immer'
import React, { useEffect } from 'react'
import { CHANGE_CLASS, CHANGE_MINE, FETCH_INITIAL_SUMMARY } from 'src/actionConstants'
import { fetchClasses, fetchInstances } from 'src/fetchSummary'
import { sendToBus, SupervisorServiceContext, useMachineBus } from 'src/machineBus'
import { Machine } from 'xstate'

import { ConstraintSection } from './Layout/ConstraintSection'
import { ChartSection, TableSection } from './Layout/DataVizSection'
import { Header } from './Layout/Header'

const supervisorMachine = Machine(
	{
		id: 'Supervisor',
		initial: 'loading',
		context: {
			classView: 'Gene',
			intermines: [],
			modelClasses: [],
			selectedMine: {
				rootUrl: 'https://www.humanmine.org/humanmine',
				name: 'HumanMine',
			},
		},
		states: {
			loading: {
				invoke: {
					id: 'fetchMines',
					src: 'fetchMinesAndClasses',
					onDone: {
						target: 'idle',
						actions: 'setIntermines',
					},
					onError: {
						target: 'idle',
						actions: (ctx, event) =>
							console.error('FETCH: could not retrieve intermines', { ctx, event }),
					},
				},
			},
			idle: {
				on: {
					[CHANGE_MINE]: { target: 'loading', actions: 'changeMine' },
					[CHANGE_CLASS]: { actions: 'changeClass' },
				},
			},
		},
	},
	{
		actions: {
			// @ts-ignore
			changeMine: assign((ctx, { newMine }) => {
				ctx.selectedMine = ctx.intermines.find((mine) => mine.name === newMine)
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
		services: {
			fetchMinesAndClasses: async (ctx, event) => {
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
	const [state, send] = useMachineBus(supervisorMachine)

	const { classView, selectedMine } = state.context
	const rootUrl = selectedMine.rootUrl

	useEffect(() => {
		sendToBus({ type: FETCH_INITIAL_SUMMARY, globalConfig: { rootUrl, classView } })
	}, [rootUrl, classView])

	return (
		<div className="light-theme">
			<SupervisorServiceContext.Provider value={{ state, send }}>
				<Header />
			</SupervisorServiceContext.Provider>
			<main
				css={{
					display: 'grid',
					gridTemplateColumns: '230px 1fr',
				}}
			>
				<ConstraintSection />
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
