import { Card } from '@blueprintjs/core'
import React from 'react'

import { PieChart } from './PieChart'

export default {
	component: PieChart,
	title: 'Components/Table and Chart',
}

export const Chart = () => (
	<Card>
		<PieChart />
	</Card>
)
