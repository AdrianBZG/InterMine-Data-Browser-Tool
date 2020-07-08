import { assign } from '@xstate/immer'
import React, { useEffect, useMemo } from 'react'
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
import { FETCH_INITIAL_SUMMARY, SET_INITIAL_ORGANISMS } from 'src/actionConstants'
import { fetchSummary } from 'src/fetchSummary'
import { Machine } from 'xstate'

import { useMachineBus } from '../../machineBus'
import { useGlobalSetup } from '../App'
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
			filteredItems: [],
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

				ctx.filteredItems = data.summary
				ctx.classView = data.classView
			}),
		},
		guards: {
			isNotInitialized: (ctx) => {
				return ctx.allClassOrganisms.length === 0
			},
		},
		services: {
			fetchItems: async (_ctx, event) => {
				const {
					type,
					globalConfig: { classView, rootUrl },
					query: nextQuery,
				} = event

				const path = 'organism.shortName'
				let query = nextQuery

				if (type === FETCH_INITIAL_SUMMARY) {
					query = {
						from: classView,
						select: ['primaryIdentifier'],
						model: {
							name: 'genomic',
						},
					}
				}

				const summary = await fetchSummary({ rootUrl, query, path })
				return {
					classView,
					summary: summary.results,
				}
			},
		},
	}
)

export const PieChart = () => {
	const globalConfig = useGlobalSetup()

	const [state, send] = useMachineBus(PieChartMachine)
	const { allClassOrganisms } = state.context

	useEffect(() => {
		send({ type: SET_INITIAL_ORGANISMS, globalConfig })
	}, [globalConfig, send])

	const chartData = useMemo(() => {
		return allClassOrganisms.map(({ item, count }) => ({
			name: item,
			value: count,
		}))
	}, [allClassOrganisms])

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
					<Label classView={globalConfig.classView} content={renderLabelContent} />
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
