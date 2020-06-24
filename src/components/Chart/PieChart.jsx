import imjs from 'imjs'
import React, { useEffect, useState } from 'react'
import { VictoryPie } from 'victory'

import { geneQueryStub, mineUrl } from '../../stubs/utils'

// https://medialab.github.io/iwanthue/
const colorBlindFriendly = [
	'#583788',
	'#73b54c',
	'#6f71d9',
	'#bbb744',
	'#bf72ca',
	'#4ec287',
	'#882862',
	'#33d4d1',
	'#d85750',
	'#5e87d3',
	'#cd8b33',
	'#d471b2',
	'#558e41',
	'#d25487',
	'#908d3a',
	'#b9475f',
	'#ca8853',
	'#c44d55',
	'#87361d',
	'#c2562e',
]

export const PieChart = () => {
	const [chartData, setChartData] = useState([])
	const service = new imjs.Service({ root: mineUrl })
	const query = new imjs.Query(geneQueryStub, service)

	useEffect(() => {
		const runQuery = async () => {
			try {
				const summary = await query.summarize('Gene.organism.shortName', 50)
				setChartData(summary.results.map((res) => ({ x: res.item, y: res.count })))
			} catch (e) {
				console.error(e.message)
			}
		}

		runQuery()
		// we want to only run this once until we attach state
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<VictoryPie
			data={chartData}
			colorScale={colorBlindFriendly}
			animate={{
				duration: 2000,
			}}
		/>
	)
}
