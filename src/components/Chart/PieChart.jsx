import { schemePaired } from 'd3-scale-chromatic'
import imjs from 'imjs'
import { styled } from 'linaria/react'
import pattern from 'patternomaly'
import React, { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'

import { geneQueryStub, mineUrl } from '../../stubs/utils'

const Label = styled.span`
	font-weight: var(--fw-bold);
	text-align: center;
	margin: 30px 0 0;
	width: 80%;
	display: inline-block;
`

const S = {
	Label,
}

export const PieChart = ({ isColorBlind = false }) => {
	const [chartData, setChartData] = useState({ data: [], labels: [] })
	const colorPalette = isColorBlind ? pattern.generate(schemePaired) : schemePaired

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
					labels.push(item.item)
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
			/>
			<S.Label>Number of results for Gene by organism</S.Label>
		</>
	)
}
