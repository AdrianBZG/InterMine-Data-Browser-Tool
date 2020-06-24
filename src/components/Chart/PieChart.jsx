import imjs from 'imjs'
import React, { useEffect, useState } from 'react'
import { VictoryPie } from 'victory'

import { geneQueryStub, mineUrl } from '../../stubs/utils'
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

	return <VictoryPie data={chartData} />
}
