import { ProgressBar } from '@blueprintjs/core'
import { useMachine } from '@xstate/react'
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
import { blinkingSkeletonAnimation } from 'src/styleUtils'
import { useEventBus, usePartialContext } from 'src/useEventBus'
import { pieChartLoadingData } from 'src/utils/loadingData/pieChartData'

import { DATA_VIZ_COLORS } from '../dataVizColors'
import { NonIdealStateWarning } from '../Shared/NonIdealStates'
import { PieChartMachine } from './pieChartMachine'

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

const renderLoadingLabel = (props) => {
	const {
		viewBox: { cx, cy },
	} = props

	return (
		<>
			<Text
				fill="var(--blue9)"
				fontSize="var(--fs-desktopS2)"
				x={cx}
				y={cy}
				textAnchor="middle"
				verticalAnchor="middle"
			>
				Loading Pie Data
			</Text>
		</>
	)
}

export const PieChart = React.memo(function PieChart() {
	const [state, , service] = useMachine(PieChartMachine)
	const [appState] = usePartialContext('appManager', (ctx) => ({
		classView: ctx.classView,
	}))

	useEventBus(service)

	const { allClassOrganisms } = state.context
	const { classView } = appState

	const { isLoading, displayingNoValues, displayingNoPaths } = state.activities
	const data = isLoading ? pieChartLoadingData : allClassOrganisms

	if (displayingNoValues || displayingNoPaths) {
		const description = displayingNoPaths
			? `The class ${classView} does not contain organism summaries`
			: 'The mine/class combination did not return any organism summaries. If you feel this an error, please contact support'

		return (
			<NonIdealStateWarning
				isWarning={displayingNoValues ? true : false}
				title="No Organism Summary available"
				description={description}
			/>
		)
	}

	return (
		<>
			<ResponsiveContainer
				width="100%"
				height="95%"
				css={isLoading ? blinkingSkeletonAnimation : {}}
			>
				<RPieChart>
					<Pie
						data={data}
						dataKey="count"
						nameKey="item"
						cy="52%"
						innerRadius={60}
						paddingAngle={1}
						animationBegin={10}
						isAnimationActive={!isLoading}
					>
						{data.map((entry, index) => (
							<Cell
								key={entry}
								fill={isLoading ? 'var(--grey2)' : DATA_VIZ_COLORS[index % DATA_VIZ_COLORS.length]}
							/>
						))}
						{classView && <Label classView={classView} content={renderLabelContent} />}
						{isLoading && <Label position="center" content={renderLoadingLabel} />}
					</Pie>
					{!isLoading && (
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
					)}
					<Legend
						iconType="circle"
						formatter={(value, _, index) => {
							return isLoading ? (
								<span
									css={{
										backgroundColor: 'var(--grey2)',
										color: 'var(--grey2)',
									}}
								>{`${value} (${data[index].count})`}</span>
							) : (
								<span>{`${value} (${data[index].count})`}</span>
							)
						}}
					/>
				</RPieChart>
			</ResponsiveContainer>
			{isLoading && <ProgressBar css={{ margin: '20px auto', width: '50%' }} intent="primary" />}
		</>
	)
})
