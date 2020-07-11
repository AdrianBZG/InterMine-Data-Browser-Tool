// import so that the IDE can add the css prop to components
import '@emotion/core'

import { assign } from '@xstate/immer'
import axios from 'axios'
import React, { useEffect } from 'react'
import { CHANGE_MINE, FETCH_INITIAL_SUMMARY } from 'src/actionConstants'
import { sendToBus, SupervisorServiceContext, useMachineBus } from 'src/machineBus'
import { Machine } from 'xstate'

import { ConstraintSection } from './Layout/ConstraintSection'
import { ChartSection, TableSection } from './Layout/DataVizSection'
import { Header } from './Layout/Header'

const supervisorMachine = Machine(
	{
		id: 'Supervisor',
		initial: 'init',
		context: {
			classView: 'Gene',
			intermines: [],
			selectedMine: {
				rootUrl: 'https://www.humanmine.org/humanmine',
				name: 'HumanMine',
			},
		},
		states: {
			init: {
				invoke: {
					id: 'fetchMines',
					src: 'fetchMines',
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
					[CHANGE_MINE]: { actions: 'changeMine' },
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
			setIntermines: assign((ctx, { data }) => {
				ctx.intermines = data.intermines
			}),
		},
		services: {
			fetchMines: async (ctx, event) => {
				const results = await axios.get('https://registry.intermine.org/service/instances', {
					params: {
						mine: 'prod',
					},
				})

				return {
					intermines: results.data.instances.map((mine) => ({
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
