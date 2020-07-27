import { ProgressBar } from '@blueprintjs/core'
import { assign } from '@xstate/immer'
import React from 'react'
// use direct import because babel is not properly changing it in webpack
import { useFirstMountState } from 'react-use/lib/useFirstMountState'
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
import { blinkingSkeletonAnimation } from 'src/styleUtils'
import { Machine } from 'xstate'

import { useMachineBus } from '../../machineBus'
import { pieChartLoadingData } from '../loadingData/pieChartData'
import { NonIdealStateWarning } from '../Shared/NonIdealStates'
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
export const PieChartMachine = Machine(
	{
		id: 'PieChart',
		initial: 'hasNoSummary',
		context: {
			allClassOrganisms: [],
			classView: '',
		},
		on: {
			// Making it global ensure we update the table when the mine/class changes
			[FETCH_INITIAL_SUMMARY]: { target: 'loading' },
			[FETCH_UPDATED_SUMMARY]: { target: 'loading' },
		},
		states: {
			idle: {},
			loading: {
				invoke: {
					id: 'fetchPieChartValues',
					src: 'fetchItems',
					onDone: {
						target: 'pending',
						actions: 'setClassItems',
					},
					onError: {
						target: 'idle',
						actions: (ctx, event) => console.error('FETCH: Pie Chart', { ctx, event }),
					},
				},
			},
			hasNoSummary: {},
			// delay the finished transition to avoid quick flashes of animations
			pending: {
				after: {
					500: [{ target: 'idle', cond: 'hasSummary' }, { target: 'hasNoSummary' }],
				},
			},
		},
	},
	{
		actions: {
			// @ts-ignore
			setClassItems: assign((ctx, { data }) => {
				ctx.allClassOrganisms = data.summary
				ctx.classView = data.classView
			}),
		},
		guards: {
			hasSummary: (ctx) => ctx.allClassOrganisms.length > 0,
		},
		services: {
			fetchItems: async (_ctx, event) => {
				const {
					globalConfig: { classView, rootUrl },
					query: nextQuery,
				} = event

				let query = {
					...nextQuery,
					from: classView,
					select: ['primaryIdentifier'],
					model: {
						name: 'genomic',
					},
				}

				const summary = await fetchSummary({ rootUrl, query, path: 'organism.shortName' })

				return {
					classView,
					summary: summary.results,
				}
			},
		},
	}
)

export const PieChart = () => {
	const isFirstRender = useFirstMountState()
	const [state] = useMachineBus(PieChartMachine)
	const { allClassOrganisms, classView } = state.context

	const isLoading = !state.matches('idle')
	const data = isLoading ? pieChartLoadingData : allClassOrganisms

	if (state.matches('hasNoSummary')) {
		const title = isFirstRender ? 'No query has been executed' : 'No Organism Summary available'
		const description = isFirstRender
			? 'Define the constraints to the left, and execute a query to see visual data results'
			: 'The mine/class combination did not return any organism summaries. If you feel this an error, please contact support'

		return <NonIdealStateWarning title={title} description={description} />
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
}
