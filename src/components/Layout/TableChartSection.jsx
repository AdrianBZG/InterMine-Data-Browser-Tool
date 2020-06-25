import { Card } from '@blueprintjs/core'
import { styled } from 'linaria/react'
import React from 'react'

import { PieChart } from '../Chart/PieChart'
import { TableSection } from './TableSection'

const StyledTableChartsSection = styled.section`
	padding: 10px 30px 0;
	overflow: auto;
	height: calc(100vh - 3.643em);
`

const Chart = styled(Card)`
	height: 380px;
	margin-bottom: 20px;
`

const S = {
	TableChartSection: StyledTableChartsSection,
	Chart: Chart,
}

export const ChartSection = () => {
	return (
		<section id="Chart">
			<S.Chart>
				<PieChart />
			</S.Chart>
		</section>
	)
}

export const TableChartSection = () => {
	return (
		<S.TableChartSection id="Tablechart">
			<ChartSection />
			<TableSection />
		</S.TableChartSection>
	)
}
