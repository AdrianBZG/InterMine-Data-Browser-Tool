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

const ChartWrapper = styled.div`
	max-width: 650px;
`

const S = {
	Card: ChartCard,
	Wrapper: ChartWrapper,
}

export const ChartSection = () => {
	return (
		<section id="Chart">
			<S.Card>
				<S.Wrapper>
					<PieChart />
				</S.Wrapper>
				<S.Wrapper>
					<BarChart />
				</S.Wrapper>
			</S.Card>
		</section>
	)
}
