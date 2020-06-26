import imjs from 'imjs'
import React, { useEffect, useState } from 'react'
import {
	Bar,
	BarChart as RBarChart,
	Brush,
	CartesianGrid,
	Cell,
	Label,
	ResponsiveContainer,
	Tooltip,
	XAxis,
} from 'recharts'

import { geneLengthQueryStub, mineUrl } from '../../stubs/utils'
import { DATA_VIZ_COLORS } from './dataVizColors'

const renderCustomTick = ({ x, y, payload }) => {
	return (
		<g transform={`translate(${x},${y})`}>
			<text
				x={0}
				y={0}
				dy={10}
				fontSize="var(--fs-desktopS1)"
				fontStyle="var(--fw-medium)"
				textAnchor="end"
				fill="var(--grey5)"
				transform="rotate(-55)"
			>
				{payload.value}
			</text>
		</g>
	)
}

const colorizeBars = (data) =>
	data.map((entry, index) => (
		<Cell key={entry} fill={DATA_VIZ_COLORS[index % DATA_VIZ_COLORS.length]} />
	))

export const BarChart = () => {
	const [chartData, setChartData] = useState([])
	const [titles, setTitles] = useState({ title: '', subtitle: '' })

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

				const title = `Distribution of ${uniqueValues} Gene Lengths`
				const subtitle = `Min: ${min} ⚬ Max: ${max} ⚬ Avg: ${avgFixed} ⚬ Stdev: ${stdevFixed}`

				const data = summary.results.flatMap((item, idx) => {
					if (idx === summary.results.length - 1) return []

					const lowerLimit = Math.round(min + elementsPerBucket * idx)
					const upperLimit = Math.round(min + elementsPerBucket * (idx + 1))

					const data = Math.log2(item.count + 1)
					const distribution = `${lowerLimit} — ${upperLimit}`
					const count = item.count

					return [
						{
							data,
							distribution,
							count,
						},
					]
				})

				setTitles({ title, subtitle })
				setChartData(data)
			} catch (e) {
				console.error(e.message)
			}
		}

		runQuery()
		// we only run this once for now until we hook in state
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<ResponsiveContainer width="100%" height="100%">
			<RBarChart data={chartData} barCategoryGap="20%" margin={{ left: 100, bottom: 200 }}>
				<Bar dataKey="data">{colorizeBars(chartData)}</Bar>
				<Tooltip
					itemStyle={{
						color: 'var(--blue9)',
					}}
					wrapperStyle={{
						border: '2px solid var(--blue9)',
						borderRadius: '3px',
					}}
					formatter={(_, __, props) => [props.payload.count, 'Total Values']}
				/>
				<CartesianGrid strokeDasharray="3 3" vertical={false} />
				<XAxis dataKey="distribution" interval={0} tick={renderCustomTick}>
					<Label
						fill="var(--blue9)"
						fontWeight={500}
						value={titles.title}
						offset={120}
						position="bottom"
					/>
					<Label
						fill="var(--blue9)"
						fontWeight={500}
						value={titles.subtitle}
						position="bottom"
						offset={150}
					/>
				</XAxis>
				<Brush dataKey="distribution" y={290}>
					<RBarChart>
						<Bar dataKey="data">{colorizeBars(chartData)}</Bar>
					</RBarChart>
				</Brush>
			</RBarChart>
		</ResponsiveContainer>
	)
}
