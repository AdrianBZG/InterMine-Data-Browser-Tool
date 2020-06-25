import imjs from 'imjs'
import React, { useEffect, useState } from 'react'
import {
	Cell,
	Label,
	Legend,
	Pie,
	PieChart as RPieChart,
	ResponsiveContainer,
	Text,
	Tooltip,
} from 'recharts'

import { geneQueryStub, mineUrl } from '../../stubs/utils'
import { DATA_VIZ_COLORS } from './dataVizColors'

const renderLabelContent = (props) => {
	const {
		viewBox: { cx, cy },
	} = props
	const positioningProps = {
		x: cx,
		y: cy - cy * 0.95,
		textAnchor: 'middle',
		verticalAnchor: 'middle',
	}

	return (
		<Text fill="var(--blue9)" fontSize="var(--fs-desktopS2)" {...positioningProps}>
			{'Number of results for Genes by organism '}
		</Text>
	)
}

export const PieChart = () => {
	const [chartData, setChartData] = useState([])

	const service = new imjs.Service({ root: mineUrl })
	const query = new imjs.Query(geneQueryStub, service)

	useEffect(() => {
		const runQuery = async () => {
			try {
				const summary = await query.summarize('Gene.organism.shortName', 50)

				const data = summary.results.map(({ item, count }) => ({
					name: item,
					value: count,
				}))

				setChartData(data)
			} catch (e) {
				console.error(e.message)
			}
		}

		runQuery()
		// we want to only run this once until we attach state
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<ResponsiveContainer width="100%" height="100%">
			<RPieChart>
				<Pie
					data={chartData}
					dataKey="value"
					nameKey="name"
					cy="52%"
					innerRadius={60}
					paddingAngle={1}
				>
					{chartData.map((entry, index) => (
						<Cell key={entry} fill={DATA_VIZ_COLORS[index % DATA_VIZ_COLORS.length]} />
					))}
					<Label content={renderLabelContent} />
				</Pie>
				<Tooltip
					labelStyle={{
						color: 'var(--blue9)',
					}}
					contentStyle={{
						borderRadius: '30px',
					}}
					wrapperStyle={{
						border: '2px solid var(--blue9)',
						borderRadius: '30px',
					}}
					separator=""
					formatter={(value, name) => [value, `${name}: `]}
				/>
				<Legend
					iconType="circle"
					formatter={(value, _, index) => <span>{`${value} (${chartData[index].value})`}</span>}
				/>
			</RPieChart>
		</ResponsiveContainer>
	)
}
