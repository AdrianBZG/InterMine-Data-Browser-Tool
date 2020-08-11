// import so that the IDE can add the css prop to components
import '@emotion/core'

import { Card } from '@blueprintjs/core'
import { useMachine } from '@xstate/react'
import React from 'react'
import { useWindowSize } from 'react-use'
import { AppManagerServiceContext, useEventBus } from 'src/useEventBus'

import { BarChart } from '../BarChart/BarChart'
import { ConstraintSection } from '../ConstraintSection/ConstraintSection'
import { NavigationBar } from '../Navigation/NavigationBar'
import { PieChart } from '../PieChart/PieChart'
import { Table } from '../Table/Table'
import { appManagerMachine } from './appManagerMachine'
import { Header } from './Header'

export const App = () => {
	const [state, , service] = useMachine(appManagerMachine)
	useEventBus(service)
	const { height } = useWindowSize()

	const { viewActors, appView } = state.context

	// hack until https://github.com/davidkpiano/xstate/issues/938 is closed
	// @ts-ignore
	if (!state.initialized) {
		service.start()
	}

	return (
		<div className="light-theme">
			<Header>
				<AppManagerServiceContext.Provider value={service}>
					<NavigationBar />
				</AppManagerServiceContext.Provider>
			</Header>
			<main css={{ display: 'grid', gridTemplateColumns: '230px 1fr' }}>
				<ConstraintSection
					templateViewActor={viewActors.templateView}
					overviewActor={viewActors.overview}
					queryControllerActor={viewActors.queryController}
					appView={appView}
				/>
				<section
					id="data-viz"
					css={{
						padding: '10px 30px 0',
						overflow: 'auto',
						height: 'calc(100vh - 100px)',
						'@media (min-width: 1157px)': {
							height: 'calc(100vh - 20px)',
						},
					}}
				>
					<section id="charts">
						<Card css={{ height: '376px', marginBottom: '10px', display: 'flex' }}>
							<div css={{ height: '100%', width: '45%' }}>
								<AppManagerServiceContext.Provider value={service}>
									<PieChart />
								</AppManagerServiceContext.Provider>
							</div>
							<div css={{ height: '100%', width: '45%' }}>
								<AppManagerServiceContext.Provider value={service}>
									<BarChart />
								</AppManagerServiceContext.Provider>
							</div>
						</Card>
					</section>
					<section id="table">
						<Card
							css={{
								marginBottom: 10,
								overflow: 'scroll',
								paddingBottom: 'unset',
								maxHeight: height - 467,
							}}
						>
							<Table />
						</Card>
					</section>
				</section>
			</main>
		</div>
	)
}
