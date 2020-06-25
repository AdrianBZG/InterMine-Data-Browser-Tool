import { Card } from '@blueprintjs/core'
import { styled } from 'linaria/react'
import React from 'react'

import * as Chart from './PieChart'

export default {
	component: Chart.PieChart,
	title: 'Components/Data Visualization',
}

const S_Card = styled(Card)`
	height: 376px;
`

export const PieChart = () => (
	<S_Card>
		<Chart.PieChart />
	</S_Card>
)
