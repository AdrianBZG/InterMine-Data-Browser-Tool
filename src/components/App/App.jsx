// import so that the IDE can add the css prop to components
import '@emotion/core'

import { Card } from '@blueprintjs/core'
import { enableMapSet } from 'immer'
import React, { useEffect } from 'react'
import { FETCH_INITIAL_SUMMARY, TOGGLE_CATEGORY_VISIBILITY } from 'src/eventConstants'
import { AppManagerServiceContext, sendToBus, useMachineBus } from 'src/machineBus'

import logo from '../../images/logo.png'
import { BarChart } from '../BarChart/BarChart'
import { ConstraintSection } from '../ConstraintSection/ConstraintSection'
import { NavigationBar } from '../Navigation/NavigationBar'
import { PieChart } from '../PieChart/PieChart'
import { Table } from '../Table/Table'
import { appManagerMachine } from './appManagerMachine'

enableMapSet()

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
						<Card css={{ marginBottom: 10, overflow: 'scroll', paddingBottom: 'unset' }}>
							<Table />
						</Card>
					</section>
				</section>
			</main>
		</div>
	)
}
