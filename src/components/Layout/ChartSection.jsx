import { Card } from '@blueprintjs/core'
import { styled } from 'linaria/react'
import React from 'react'

import { BarChart } from '../Chart/BarChart'
import { PieChart } from '../Chart/PieChart'

const ChartCard = styled(Card)`
	height: 380px;
	margin-bottom: 20px;
	display: flex;
`

const PieWrapper = styled.div`
	width: 600px;
	float: left;
`

const BarWrapper = styled.div`
	width: 600px;
	float: right;
`

const S = {
	Card: ChartCard,
	PieWrapper,
	BarWrapper,
}

export const ChartSection = () => {
	return (
		<section id="Chart">
			<S.Card>
				<S.PieWrapper>
					<PieChart />
				</S.PieWrapper>
				<S.BarWrapper>
					<BarChart />
				</S.BarWrapper>
			</S.Card>
		</section>
	)
}
