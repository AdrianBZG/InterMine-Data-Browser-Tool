import { Card } from '@blueprintjs/core'
import { css } from 'linaria'
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

export const Chart = () => (
	<StyledCard>
		<div
			className={css`
				height: 80%;
				width: 500px;
			`}
		>
			<PieChart />
		</div>
	</StyledCard>
)
