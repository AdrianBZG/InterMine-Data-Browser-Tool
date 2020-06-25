import { Card } from '@blueprintjs/core'
import { styled } from 'linaria/react'
import React from 'react'

import * as Chart from './PieChart'

export default {
	component: Chart.PieChart,
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

export const PieChart = () => (
	<S.Card>
		<S.PieWrapper>
			<Chart.PieChart />
		</S.PieWrapper>
	</S.Card>
)
