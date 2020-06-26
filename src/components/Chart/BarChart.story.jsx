import { Card } from '@blueprintjs/core'
import { styled } from 'linaria/react'
import React from 'react'

import * as Chart from './BarChart'

export default {
	component: Chart.BarChart,
	title: 'Components/Data Visualization',
}

const S_Card = styled(Card)`
	height: 376px;
`

export const BarChart = () => (
	<S_Card>
		<Chart.BarChart />
	</S_Card>
)
