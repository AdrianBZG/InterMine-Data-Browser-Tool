// import so that the IDE can add the css prop to components
import '@emotion/core'

import React, { createContext, useContext, useEffect } from 'react'
import { FETCH_INITIAL_SUMMARY } from 'src/actionConstants'
import { sendToBus } from 'src/machineBus'

import { ConstraintSection } from './Layout/ConstraintSection'
import { ChartSection, TableSection } from './Layout/DataVizSection'
import { Header } from './Layout/Header'

const GlobalConfig = createContext(null)

export const useGlobalSetup = () => {
	const globalConfig = useContext(GlobalConfig)

	if (globalConfig === null) {
		throw Error('There are no global values set for the root url or classview')
	}

	return globalConfig
}

export const App = () => {
	const globalConfig = {
		rootUrl: 'https://www.humanmine.org/humanmine',
		classView: 'Gene',
	}

	useEffect(() => {
		sendToBus({ type: FETCH_INITIAL_SUMMARY, globalConfig })
	}, [globalConfig])

	return (
		<GlobalConfig.Provider value={globalConfig}>
			<div className="light-theme">
				<Header />
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
		</GlobalConfig.Provider>
	)
}
