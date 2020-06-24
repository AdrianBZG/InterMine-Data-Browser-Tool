import { Card } from '@blueprintjs/core'
import { css } from 'linaria'
import React from 'react'

import { PieChart } from './PieChart'

export default {
	component: PieChart,
	title: 'Components/Data Visualization',
}

export const Chart = () => (
	<Card
		className={css`
			width: 500px;
		`}
	>
		<PieChart />
	</Card>
)
