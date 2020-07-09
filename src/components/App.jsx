// import so that the IDE can add the css prop to components
import '@emotion/core'

import React, { useEffect } from 'react'
import { FETCH_INITIAL_SUMMARY } from 'src/actionConstants'
import { sendToBus } from 'src/machineBus'

import { ConstraintSection } from './Layout/ConstraintSection'
import { ChartSection, TableSection } from './Layout/DataVizSection'
import { Header } from './Layout/Header'

export const App = () => {
	const globalConfig = {
		rootUrl: 'https://www.humanmine.org/humanmine',
		classView: 'Gene',
	}

	useEffect(() => {
		sendToBus({ type: FETCH_INITIAL_SUMMARY, globalConfig })
	}, [globalConfig])

	return (
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
	)
}
