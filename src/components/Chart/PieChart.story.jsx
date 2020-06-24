import { Card } from '@blueprintjs/core'
import { css } from 'linaria'
import React from 'react'

import { PieChart } from './PieChart'

export default {
	component: PieChart,
	title: 'Components/Table and Chart',
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
