// ignore file coverage
import { Card } from '@blueprintjs/core'
import styled from '@emotion/styled'
import React from 'react'

import { MockMachineContext } from '../../machineBus'
import { lengthSummary, orrganismSummary } from '../../stubs/geneSummaries'
import { humanMine25 } from '../../stubs/humanMine25'
import { mineUrl } from '../../stubs/utils'
import { BarChart as Bar, BarChartMachine } from './BarChart'
import { PieChart as Pie, PieChartMachine } from './PieChart'
import { Table as TableComp, TableChartMachine } from './Table'

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

const barMockMachine = BarChartMachine.withContext({
	lengthSummary: lengthSummary.stats,
	results: lengthSummary.results.slice(0, lengthSummary.results.length - 1),
})

export const BarChart = () => (
	<MockMachineContext.Provider value={barMockMachine}>
		<S_Card>
			<Bar />
		</S_Card>
	</MockMachineContext.Provider>
)

BarChart.parameters = {
	docs: {
		storyDescription:
			'Bar charts display the result of the gene distribution for the given constraints',
	},
}

const pieMockMachine = PieChartMachine.withContext({ classItems: orrganismSummary.results })

export const PieChart = () => (
	<MockMachineContext.Provider value={pieMockMachine}>
		<S_Card>
			<Pie />
		</S_Card>
	</MockMachineContext.Provider>
)

PieChart.parameters = {
	docs: {
		storyDescription:
			'Pie charts displays the number of results by organism for the given constraints',
	},
}

const tableMockMachine = TableChartMachine.withContext({
	rows: humanMine25,
	mineUrl,
})

export const Table = () => (
	<MockMachineContext.Provider value={tableMockMachine}>
		<Card>
			<TableComp />
		</Card>
	</MockMachineContext.Provider>
)

Table.parameters = {
	docs: {
		storyDescription: 'Displays all the rows of results for the given constraints',
	},
}
