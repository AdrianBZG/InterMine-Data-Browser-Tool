import { Card } from '@blueprintjs/core'
import { styled } from 'linaria/react'
import React from 'react'

import { humanMine25 as rows } from '../../stubs/humanMine25'
import { mineUrl } from '../../stubs/utils'
import { BarChart as Bar } from './BarChart'
import { PieChart as Pie } from './PieChart'
import { Table as TableComp } from './Table'

export default {
	title: 'Components/Data Visualization',
	parameters: {
		componentSubtitle: 'These are the various ways we display results from an intermine',
	},
}

const S_Card = styled(Card)`
	height: 376px;
`

export const Empty = () => <></>

export const BarChart = () => (
	<S_Card>
		<Bar />
	</S_Card>
)

BarChart.parameters = {
	docs: {
		storyDescription:
			'Bar charts display the result of the gene distribution for the given constraints',
	},
}

export const PieChart = () => (
	<S_Card>
		<Pie />
	</S_Card>
)

PieChart.parameters = {
	docs: {
		storyDescription:
			'Pie charts displays the number of results by organism for the given constraints',
	},
}

export const Table = () => (
	<Card>
		<TableComp mineUrl={mineUrl} rows={rows} />
	</Card>
)

Table.parameters = {
	docs: {
		storyDescription: 'Displays all the rows of results for the given constraints',
	},
}
