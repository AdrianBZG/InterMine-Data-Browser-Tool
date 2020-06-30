// import so that the IDE can add the css prop to components
import '@emotion/core'

import React from 'react'

import { ConstraintSection } from './Layout/ConstraintSection'
import { ChartSection, TableSection } from './Layout/DataVizSection'
import { Header } from './Layout/Header'

export const App = () => {
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
