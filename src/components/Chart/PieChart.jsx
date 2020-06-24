import { ResponsivePie } from '@nivo/pie'
import imjs from 'imjs'
import { styled } from 'linaria/react'
import React, { useEffect, useState } from 'react'

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

export const PieChart = () => {
	const [chartData, setChartData] = useState([])
	const service = new imjs.Service({ root: mineUrl })
	const query = new imjs.Query(geneQueryStub, service)

	useEffect(() => {
		const runQuery = async () => {
			try {
				const summary = await query.summarize('Gene.organism.shortName', 50)
				setChartData(
					summary.results.map((res) => ({
						id: res.item,
						value: res.count,
						label: `${res.item} (${res.count})`,
					}))
				)
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
			<ResponsivePie
				data={chartData}
				innerRadius={0.5}
				padAngle={0.8}
				margin={{ left: -200, top: 0, bottom: 0, right: 20 }}
				cornerRadius={3}
				colors={{ scheme: 'accent' }}
				enableSlicesLabels={false}
				enableRadialLabels={false}
				borderWidth={1}
				sortByValue={true}
				borderColor={{ from: 'color', modifiers: [['darker', 0.5]] }}
				animate={true}
				motionStiffness={90}
				motionDamping={15}
				theme={{
					legends: {
						text: {
							fontSize: 'var(--fs-desktopS2)',
						},
					},
				}}
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
						anchor: 'top-right',
						direction: 'column',
						itemWidth: 200,
						itemHeight: 36,
						itemTextColor: 'var(--blue9)',
						symbolSize: 24,
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
			<S.Label>Number of results for Gene by organism</S.Label>
		</>
	)
}
