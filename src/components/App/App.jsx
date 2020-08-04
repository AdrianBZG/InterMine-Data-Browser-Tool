// import so that the IDE can add the css prop to components
import '@emotion/core'

import { Card } from '@blueprintjs/core'
import { useMachine } from '@xstate/react'
import { enableMapSet } from 'immer'
import React from 'react'
import { useWindowSize } from 'react-use'
import { AppManagerServiceContext, useEventBus } from 'src/useEventBus'

import logo from '../../images/logo.png'
import { BarChart } from '../BarChart/BarChart'
import { ConstraintSection } from '../ConstraintSection/ConstraintSection'
import { NavigationBar } from '../Navigation/NavigationBar'
import { PieChart } from '../PieChart/PieChart'
import { Table } from '../Table/Table'
import { appManagerMachine } from './appManagerMachine'

enableMapSet()

export const App = () => {
	const [state, send, service] = useMachine(appManagerMachine)
	useEventBus(service)
	const { height } = useWindowSize()

	const { viewActors } = state.context

	return (
		<div className="light-theme">
			<AppManagerServiceContext.Provider value={{ state, send }}>
				<header css={{ display: 'inline-flex', width: '100%' }}>
					<div
						css={{
							minWidth: '230px',
							height: 43,
							display: 'inline-flex',
							alignItems: 'center',
							justifyContent: 'center',
							borderRight: '2px solid var(--blue5)',
							borderBottom: '2px solid var(--blue5)',
						}}
					>
						<img width="120px" src={logo} alt="Logo" />
					</div>
					<NavigationBar />
				</header>
			</AppManagerServiceContext.Provider>
			<main css={{ display: 'grid', gridTemplateColumns: '230px 1fr' }}>
				<ConstraintSection
					templateViewActor={viewActors.templateView}
					overviewActor={viewActors.overview}
					queryControllerActor={viewActors.queryController}
				/>
				<section
					id="data-viz"
					css={{ padding: '10px 30px 0', overflow: 'auto', height: 'calc(100vh - 3.643em)' }}
				>
					<section id="charts">
						<Card css={{ height: '376px', marginBottom: '20px', display: 'flex' }}>
							<div css={{ height: '100%', width: '45%' }}>
								<PieChart />
							</div>
							<div css={{ height: '100%', width: '45%' }}>
								<BarChart />
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
