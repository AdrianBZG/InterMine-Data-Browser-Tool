import { Card } from '@blueprintjs/core'
import { styled } from 'linaria/react'
import React from 'react'

import { PieChart } from './PieChart'

export default {
	component: PieChart,
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

export const Chart = () => (
	<S.Card>
		<S.PieWrapper>
			<PieChart />
		</S.PieWrapper>
	</S.Card>
)
