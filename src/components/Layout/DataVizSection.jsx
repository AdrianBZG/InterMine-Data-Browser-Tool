import { Card } from '@blueprintjs/core'
import styled from '@emotion/styled'
import React from 'react'

import { BarChart, PieChart, Table } from '../DataViz'

const S_ChartContainer = styled.div`
	height: 100%;
	width: 45%;
`

export const ChartSection = () => {
	return (
		<section id="charts">
			<Card
				css={{
					height: '376px',
					marginBottom: '20px',
					display: 'flex',
				}}
			>
				<S_ChartContainer>
					<PieChart />
				</S_ChartContainer>
				<S_ChartContainer>
					<BarChart />
				</S_ChartContainer>
			</Card>
		</section>
	)
}

export const TableSection = () => {
	return (
		<section>
			<Card
				css={{
					marginBottom: 10,
					overflow: 'scroll',
					paddingBottom: 'unset',
				}}
			>
				<Table />
			</Card>
		</section>
	)
}

export const TableChartSection = () => {
	return (
		<section
			css={{
				padding: '10px 30px 0',
				overflow: 'auto',
				height: 'height: calc(100vh - 3.643em)',
			}}
			id="Tablechart"
		>
			<ChartSection />
			<TableSection />
		</section>
	)
}
