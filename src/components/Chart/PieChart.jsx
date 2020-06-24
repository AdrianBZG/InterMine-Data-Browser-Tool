import { ResponsivePie } from '@nivo/pie'
import imjs from 'imjs'
import React, { useEffect, useState } from 'react'

import { geneQueryStub, mineUrl } from '../../stubs/utils'

export const PieChart = () => {
	const [chartData, setChartData] = useState([])
	const service = new imjs.Service({ root: mineUrl })
	const query = new imjs.Query(geneQueryStub, service)

	useEffect(() => {
		const runQuery = async () => {
			try {
				const summary = await query.summarize('Gene.organism.shortName', 50)
				setChartData(summary.results.map((res) => ({ id: res.item, value: res.count })))
			} catch (e) {
				console.error(e.message)
			}
		}

		runQuery()
		// we want to only run this once until we attach state
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<ResponsivePie
			data={chartData}
			margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
			innerRadius={0.5}
			padAngle={1.5}
			cornerRadius={3}
			width={448}
			colors={{ scheme: 'accent' }}
			enableSlicesLabels={false}
			borderWidth={1}
			sortByValue={true}
			borderColor={{ from: 'color', modifiers: [['darker', 0.5]] }}
			radialLabel={(e) => e.id + ' (' + e.value + ')'}
			radialLabelsSkipAngle={10}
			radialLabelsTextXOffset={6}
			radialLabelsTextColor="#333333"
			radialLabelsLinkOffset={0}
			radialLabelsLinkDiagonalLength={16}
			radialLabelsLinkHorizontalLength={24}
			radialLabelsLinkStrokeWidth={1}
			radialLabelsLinkColor={{ theme: 'axis.ticks.line.stroke' }}
			slicesLabelsSkipAngle={10}
			slicesLabelsTextColor="#333333"
			animate={true}
			motionStiffness={90}
			motionDamping={15}
			defs={[
				{
					id: 'dots',
					type: 'patternDots',
					background: 'inherit',
					color: 'rgba(255, 255, 255, 0.3)',
					size: 4,
					padding: 1,
					stagger: true,
				},
				{
					id: 'lines',
					type: 'patternLines',
					background: 'inherit',
					color: 'rgba(255, 255, 255, 0.3)',
					rotation: -45,
					lineWidth: 6,
					spacing: 10,
				},
			]}
			fill={[
				{
					match: (d) => {
						return d.index % 5 === 0
					},
					id: 'dots',
				},
				{
					match: (d) => {
						return d.index % 3 === 0
					},
					id: 'lines',
				},
			]}
			legends={[
				{
					anchor: 'bottom',
					direction: 'row',
					translateY: 56,
					itemWidth: 100,
					itemHeight: 18,
					itemTextColor: '#999',
					symbolSize: 18,
					symbolShape: 'circle',
					effects: [
						{
							on: 'hover',
							style: {
								itemTextColor: '#000',
							},
						},
					],
				},
			]}
		/>
	)
}
