import { ELEVATION_0 } from '@blueprintjs/core/lib/esm/common/classes'
import { assign } from '@xstate/immer'
import React from 'react'
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
import { FETCH_INITIAL_SUMMARY } from 'src/actionConstants'
import { fetchSummary } from 'src/fetchSummary'
import { Machine } from 'xstate'

import { useMachineBus } from '../../machineBus'
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

export const BarChartMachine = Machine(
	{
		id: 'BarChart',
		initial: 'idle',
		context: {
			lengthStats: {
				min: 0,
				max: 0,
				buckets: 0,
				uniqueValues: 0,
				average: ELEVATION_0,
				stdev: 0,
			},
			lengthSummary: [],
			classView: '',
		},
		states: {
			idle: {
				on: {
					[FETCH_INITIAL_SUMMARY]: { target: 'loading', cond: 'isNotInitialized' },
				},
			},
			loading: {
				invoke: {
					id: 'fetchGeneLength',
					src: 'fetchGeneLength',
					onDone: {
						target: 'idle',
						actions: 'setLengthSummary',
					},
				},
			},
		},
	},
	{
		actions: {
			// @ts-ignore
			setLengthSummary: assign((ctx, { data }) => {
				ctx.lengthStats = data.lengthStats
				ctx.lengthSummary = data.lengthSummary
				ctx.classView = data.classView
			}),
		},
		guards: {
			isNotInitialized: () => true,
		},
		services: {
			fetchGeneLength: async (
				_ctx,
				{ type, globalConfig: { classView, rootUrl }, query: nextQuery }
			) => {
				let query = nextQuery
				let path = 'length'

				if (type === FETCH_INITIAL_SUMMARY) {
					query = {
						from: classView,
						select: ['length', 'primaryIdentifier'],
						model: {
							name: 'genomic',
						},
						orderBy: [
							{
								path: 'length',
								direction: 'ASC',
							},
						],
					}
				}

				const summary = await fetchSummary({ rootUrl, query, path })

				return {
					classView,
					lengthStats: summary.stats,
					lengthSummary: summary.results.slice(0, summary.results.length - 1),
				}
			},
		},
	}
)

export const BarChart = () => {
	const [
		{
			context: { lengthStats, lengthSummary },
		},
	] = useMachineBus(BarChartMachine)

	const { max, min, buckets, uniqueValues, average, stdev } = lengthStats

	const elementsPerBucket = (max - min) / buckets
	const stdevFixed = parseFloat(`${stdev}`).toFixed(3)
	const avgFixed = parseFloat(`${average}`).toFixed(3)

	const title = `Distribution of ${uniqueValues} Gene Lengths`
	const subtitle = `Min: ${min} ⚬ Max: ${max} ⚬ Avg: ${avgFixed} ⚬ Stdev: ${stdevFixed}`

	const chartData = lengthSummary.map((item, idx) => {
		const lowerLimit = Math.round(min + elementsPerBucket * idx)
		const upperLimit = Math.round(min + elementsPerBucket * (idx + 1))

		const data = Math.log2(item.count + 1)
		const distribution = `${lowerLimit} — ${upperLimit}`
		const count = item.count

		return {
			data,
			distribution,
			count,
		}
	})

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
						value={title}
						offset={120}
						position="bottom"
					/>
					<Label
						fill="var(--blue9)"
						fontWeight={500}
						value={subtitle}
						position="bottom"
						offset={150}
					/>
				</XAxis>
				{chartData.length > 0 && (
					<Brush dataKey="distribution" y={290}>
						<RBarChart>
							<Bar dataKey="data">{colorizeBars(chartData)}</Bar>
						</RBarChart>
					</Brush>
				)}
			</RBarChart>
		</ResponsiveContainer>
	)
}
