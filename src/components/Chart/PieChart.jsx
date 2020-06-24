import imjs from 'imjs'
import pattern from 'patternomaly'
import React, { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'

import { geneQueryStub, mineUrl } from '../../stubs/utils'

const scheme = [
	'#898cff ',
	'#f589b6',
	'#fcdc89',
	'#90d4f7',
	'#71e096',
	'#f5a26e',
	'#668de5',
	'#ed6d79',
	'#5ad0e5',
	'#cff381',
	'#f696e3',
	'#bb96ff',
	'#67eebd',
]

export const PieChart = ({ isColorBlind = true }) => {
	const [chartData, setChartData] = useState({ data: [], labels: [] })
	const colorPalette = isColorBlind ? pattern.generate(scheme) : scheme

	const service = new imjs.Service({ root: mineUrl })
	const query = new imjs.Query(geneQueryStub, service)

	useEffect(() => {
		const runQuery = async () => {
			try {
				const summary = await query.summarize('Gene.organism.shortName', 50)
				const data = []
				const labels = []

				summary.results.forEach((item) => {
					data.push(item.count)
					labels.push(`${item.item} (${item.count})`)
				})

				setChartData({ data, labels })
			} catch (e) {
				console.error(e.message)
			}
		}

		runQuery()
		// we want to only run this once until we attach state
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<Doughnut
				data={{
					datasets: [{ data: chartData.data, backgroundColor: colorPalette }],
					labels: chartData.labels,
				}}
				legend={{
					position: 'left',
					labels: {
						fontStyle: 'var(--fw-medium)',
						fontColor: 'var(--blue9)',
						padding: 16,
					},
				}}
				options={{
					title: {
						display: true,
						text: 'Number of results for Gene by organism',
						fontSize: 18,
						fontStyle: 'var(--fw-medium)',
						fontColor: 'var(--blue9)',
						padding: 16,
					},
				}}
			/>
		</>
	)
}
