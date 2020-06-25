import imjs from 'imjs'
import pattern from 'patternomaly'
import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'

import { geneLengthQueryStub, mineUrl } from '../../stubs/utils'

const colorPalette = [
	pattern.draw('dot', '#898cff '),
	'#90d4f7',
	pattern.draw('dot-dash', '#71e096'),
	'#fcdc89',
	'#f5a26e',
	pattern.draw('diagonal', '#f589b6'),
	'#668de5',
	'#ed6d79',
	'#5ad0e5',
	'#cff381',
	'#f696e3',
	'#bb96ff',
	'#67eebd',
]

export const BarChart = () => {
	const [chartData, setChartData] = useState({ countData: [], labelsData: [], onHoverLabel: [] })
	const [titles, setTitles] = useState([])
	const service = new imjs.Service({ root: mineUrl })
	const query = new imjs.Query(geneLengthQueryStub, service)

	useEffect(() => {
		const runQuery = async () => {
			try {
				const summary = await query.summarize('Gene.length', 50)

				const { max, min, buckets, uniqueValues, average, stdev } = summary.stats

				const elementsPerBucket = (max - min) / buckets
				const stdevFixed = parseFloat(stdev).toFixed(3)
				const avgFixed = parseFloat(average).toFixed(3)

				const countData = []
				const labelsData = []
				const onHoverLabel = []
				summary.results.forEach((_, i) => {
					if (i < summary.results.length - 1) {
						const lowerLimit = Math.round(min + elementsPerBucket * i)
						const upperLimit = Math.round(min + elementsPerBucket * (i + 1))

						countData.push(Math.log2(summary.results[i].count + 1))
						labelsData.push(`${lowerLimit} — ${upperLimit}`)
						onHoverLabel.push(`${lowerLimit} to ${upperLimit}: ${summary.results[i].count} values`)
					}
				})

				setChartData({ countData, labelsData, onHoverLabel })

				const chartTitle = `Distribution of ${uniqueValues} Gene Lengths`
				const chartSubtitle = `Min: ${min} Max: ${max} Avg: ${avgFixed} Stdev: ${stdevFixed}`
				setTitles([chartTitle, chartSubtitle])
			} catch (e) {
				console.error(e.message)
			}
		}

		runQuery()
		// we only run this once for now until we hook in state
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	let moreColors = colorPalette

	while (moreColors.length < chartData.countData.length) {
		moreColors = [...moreColors, ...colorPalette]
	}

	return (
		<Bar
			data={{
				labels: chartData.labelsData,
				datasets: [
					{
						data: chartData.countData,
						backgroundColor: moreColors,
					},
				],
			}}
			options={{
				legend: {
					display: false,
				},
				title: {
					display: true,
					text: titles,
					position: 'bottom',
				},
				scales: {
					xAxes: [
						{
							gridLines: {
								display: false,
							},
							ticks: {
								display: true,
							},
						},
					],
					yAxes: [
						{
							gridLines: {
								drawTicks: false,
							},
							ticks: {
								display: false,
							},
						},
					],
				},
			}}
		/>
	)
}
