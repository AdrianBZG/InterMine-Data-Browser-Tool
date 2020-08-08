import { ProgressBar } from '@blueprintjs/core'
import { useMachine } from '@xstate/react'
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
import { blinkingSkeletonAnimation } from 'src/styleUtils'
import { useEventBus } from 'src/useEventBus'
import { barChartLoadingData } from 'src/utils/loadingData/barChartData'

import { DATA_VIZ_COLORS } from '../dataVizColors'
import { NonIdealStateWarning } from '../Shared/NonIdealStates'
import { BarChartMachine } from './barChartMachine'

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

export const BarChart = React.memo(function BarChart() {
	const isFirstRender = useFirstMountState()
	const [state, , service] = useMachine(BarChartMachine)
	useEventBus(service)

	const { lengthSummary, lengthStats } = state.context

	const { isLoading } = state.activities
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

	if (state.activities.hasNoValues) {
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
})
