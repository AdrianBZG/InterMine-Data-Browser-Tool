import { Card } from '@blueprintjs/core'
import { styled } from 'linaria/react'
import React from 'react'

import { BarChart } from '../Chart/BarChart'
import { PieChart } from '../Chart/PieChart'

const S_Card = styled(Card)`
	height: 376px;
	margin-bottom: 20px;
	display: flex;
`

const S_ChartContainer = styled.div`
	height: 100%;
	width: 45%;
`

export const ChartSection = () => {
	return (
		<section id="charts">
			<S_Card>
				<S_ChartContainer>
					<PieChart />
				</S_ChartContainer>
				<S_ChartContainer>
					<BarChart />
				</S_ChartContainer>
			</S_Card>
		</section>
	)
}
