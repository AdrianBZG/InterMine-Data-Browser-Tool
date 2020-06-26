import { styled } from 'linaria/react'
import React from 'react'

import { ConstraintSection } from './Layout/ConstraintSection'
import { ChartSection, TableSection } from './Layout/DataVizSection'
import { Header } from './Layout/Header'

const S_TableChartsSection = styled.section`
	padding: 10px 30px 0;
	overflow: auto;
	height: calc(100vh - 3.643em);
`

const S_Main = styled.main`
	display: grid;
	grid-template-columns: 230px 1fr;
`

export const App = () => {
	return (
		<div className="light-theme">
			<Header />
			<S_Main>
				<ConstraintSection />
				<S_TableChartsSection>
					<ChartSection />
					<TableSection />
				</S_TableChartsSection>
			</S_Main>
		</div>
	)
}
