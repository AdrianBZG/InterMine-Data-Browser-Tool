import { Card } from '@blueprintjs/core'
import { styled } from 'linaria/react'
import React from 'react'

import * as Chart from './BarChart'

export default {
	component: Chart.BarChart,
	title: 'Components/Data Visualization',
}

const StyledCard = styled(Card)`
	height: 376px;
`

const StyledPieWrapper = styled.div`
	max-width: 600px;
`

const S = {
	Card: StyledCard,
	PieWrapper: StyledPieWrapper,
}

export const BarChart = () => (
	<S.Card>
		<S.PieWrapper>
			<Chart.BarChart />
		</S.PieWrapper>
	</S.Card>
)
