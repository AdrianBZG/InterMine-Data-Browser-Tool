import { assign } from '@xstate/immer'
import React from 'react'
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
import { FETCH_INITIAL_SUMMARY, FETCH_UPDATED_SUMMARY } from 'src/actionConstants'
import { fetchSummary } from 'src/fetchSummary'
import { Machine } from 'xstate'

import { useMachineBus } from '../../machineBus'
import { DATA_VIZ_COLORS } from './dataVizColors'

const renderLabelContent = (props) => {
	const {
		viewBox: { cx, cy },
	} = props

	return (
		<Text
			fill="var(--blue9)"
			fontSize="var(--fs-desktopS2)"
			x={cx}
			y={cy - cy * 0.95}
			textAnchor="middle"
			verticalAnchor="middle"
		>
			{`Number of results for ${props.classView} by organism`}
		</Text>
	)
}

export const PieChartMachine = Machine(
	{
		id: 'PieChart',
		initial: 'idle',
		context: {
			allClassOrganisms: [],
			filteredOrganisms: [],
			classView: '',
		},
		states: {
			idle: {
				on: {
					[FETCH_INITIAL_SUMMARY]: { target: 'loading' },
					[FETCH_UPDATED_SUMMARY]: { target: 'loading' },
				},
			},
			loading: {
				invoke: {
					id: 'fetchPieChartValues',
					src: 'fetchItems',
					onDone: {
						target: 'idle',
						actions: 'setClassItems',
					},
					onError: {
						target: 'idle',
						actions: (ctx, event) => console.error('FETCH: Pie Chart', { ctx, event }),
					},
				},
			},
		},
	},
	{
		actions: {
			// @ts-ignore
			setClassItems: assign((ctx, { data }) => {
				if (ctx.allClassOrganisms.length === 0) {
					ctx.allClassOrganisms = data.summary
				}

				ctx.filteredOrganisms = data.summary
			}),
		},
		services: {
			fetchItems: async (_ctx, event) => {
				const {
					type,
					globalConfig: { classView, rootUrl },
					query: nextQuery,
				} = event

				const path = 'organism.shortName'
				let query = {
					...nextQuery,
					from: classView,
					model: {
						name: 'genomic',
					},
				}

				if (type === FETCH_INITIAL_SUMMARY) {
					query.select = ['primaryIdentifier']
				}

				const summary = await fetchSummary({ rootUrl: `${rootUrl}/service`, query, path })

				return {
					classView,
					summary: summary.results,
				}
			},
		},
	}
)

export const PieChart = () => {
	const [state] = useMachineBus(PieChartMachine)
	const { filteredOrganisms, classView } = state.context

	const chartData = filteredOrganisms.map(({ item, count }) => ({
		name: item,
		value: count,
	}))

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
					<Label classView={classView} content={renderLabelContent} />
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
