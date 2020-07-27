import { ProgressBar } from '@blueprintjs/core'
import { assign } from '@xstate/immer'
import React from 'react'
// use direct import because babel is not properly changing it in webpack
import { useFirstMountState } from 'react-use/lib/useFirstMountState'
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
import { FETCH_INITIAL_SUMMARY, FETCH_UPDATED_SUMMARY } from 'src/actionConstants'
import { fetchSummary } from 'src/fetchSummary'
import { blinkingSkeletonAnimation } from 'src/styleUtils'
import { Machine } from 'xstate'

import { useMachineBus } from '../../machineBus'
import { barChartLoadingData } from '../loadingData/barChartData'
import { NonIdealStateWarning } from '../Shared/NonIdealStates'
import { DATA_VIZ_COLORS } from './dataVizColors'

const renderCustomTick = (isLoading) => ({ x, y, payload }) => {
	return (
		<g transform={`translate(${x},${y})`}>
			{isLoading ? (
				<rect width={5} height={50} fill="var(--grey2)" transform="rotate(45)">
					{payload.value}
				</rect>
			) : (
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
			)}
		</g>
	)
}

const colorizeBars = (data, isLoading) =>
	data.map((entry, index) => (
		<Cell
			key={entry}
			fill={isLoading ? 'var(--grey2)' : DATA_VIZ_COLORS[index % DATA_VIZ_COLORS.length]}
		/>
	))

export const BarChartMachine = Machine(
	{
		id: 'BarChart',
		initial: 'noGeneLengths',
		context: {
			lengthStats: {
				min: 0,
				max: 0,
				buckets: 0,
				uniqueValues: 0,
				average: 0,
				stdev: 0,
			},
			lengthSummary: [],
			classView: '',
		},
		on: {
			// Making it global ensures that we retry when the mine or class changes
			[FETCH_INITIAL_SUMMARY]: { target: 'loading' },
			[FETCH_UPDATED_SUMMARY]: { target: 'loading' },
		},
		states: {
			idle: {},
			loading: {
				invoke: {
					id: 'fetchGeneLength',
					src: 'fetchGeneLength',
					onDone: {
						target: 'pending',
						actions: 'setLengthSummary',
					},
					onError: {
						target: 'noGeneLengths',
						actions: 'logErrorToConsole',
					},
				},
			},
			noGeneLengths: {},
			pending: {
				after: {
					500: [{ target: 'idle', cond: 'hasSummary' }, { target: 'noGeneLengths' }],
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
			// @ts-ignore
			logErrorToConsole: (ctx, event) => console.warn(event.data),
		},
		guards: {
			hasSummary: (ctx) => {
				return ctx.lengthSummary.length > 0
			},
		},
		services: {
			fetchGeneLength: async (_ctx, { globalConfig: { classView, rootUrl }, query: nextQuery }) => {
				let query = {
					...nextQuery,
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

				const summary = await fetchSummary({ rootUrl, query, path: 'length' })

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
	const isFirstRender = useFirstMountState()
	const [state] = useMachineBus(BarChartMachine)

	const { lengthSummary, lengthStats } = state.context

	const isLoading = !state.matches('idle')
	const summary = isLoading ? barChartLoadingData : lengthSummary

	const { max, min, buckets, uniqueValues, average, stdev } = lengthStats

	const elementsPerBucket = (max - min) / buckets
	const stdevFixed = parseFloat(`${stdev}`).toFixed(3)
	const avgFixed = parseFloat(`${average}`).toFixed(3)

	const title = `Distribution of ${uniqueValues} Gene Lengths`
	const subtitle = `Min: ${min} ⚬ Max: ${max} ⚬ Avg: ${avgFixed} ⚬ Stdev: ${stdevFixed}`

	const chartData = summary.map((item, idx) => {
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

	if (state.matches('noGeneLengths')) {
		const title = isFirstRender ? 'No query has been executed' : 'No Gene lengths available'
		const description = isFirstRender
			? 'Define the constraints to the left, and execute a query to see visual data results'
			: 'The mine/class combination does not provide gene lengths. If you feel this is an error, please contact support'

		return <NonIdealStateWarning title={title} description={description} />
	}

	return (
		<>
			<ResponsiveContainer
				width="100%"
				height="95%"
				css={isLoading ? blinkingSkeletonAnimation : {}}
			>
				<RBarChart data={chartData} barCategoryGap="20%" margin={{ left: 100, bottom: 200 }}>
					<Bar dataKey="data">{colorizeBars(chartData, isLoading)}</Bar>
					{!isLoading && (
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
					)}
					<CartesianGrid strokeDasharray="3 3" vertical={false} />
					<XAxis dataKey="distribution" interval={0} tick={renderCustomTick(isLoading)}>
						<Label
							fill="var(--blue9)"
							fontWeight={500}
							value={isLoading ? 'Loading Bar data' : title}
							offset={120}
							position="bottom"
						/>
						<Label
							fill="var(--blue9)"
							fontWeight={500}
							value={subtitle}
							position="bottom"
							offset={150}
							content={
								isLoading
									? () => <rect width="70%" height={16} y={250} x="25%" fill="var(--grey2)" />
									: null
							}
						/>
					</XAxis>
					{chartData.length > 0 && (
						<Brush dataKey="distribution" y={280}>
							<RBarChart>
								<Bar dataKey="data">{colorizeBars(chartData, isLoading)}</Bar>
							</RBarChart>
						</Brush>
					)}
				</RBarChart>
			</ResponsiveContainer>
			{isLoading && (
				<ProgressBar intent="primary" css={{ width: '50%', marginLeft: '35%', marginTop: 20 }} />
			)}
		</>
	)
}
