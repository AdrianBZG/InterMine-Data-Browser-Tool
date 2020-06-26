import { Card } from '@blueprintjs/core'
import { styled } from 'linaria/react'
import React from 'react'

import { humanMine25 as rows } from '../../stubs/humanMine25'
import { mineUrl } from '../../stubs/utils'
import { BarChart, PieChart, Table, TableActionButtons, TablePagingButtons } from '../DataViz'

const S_Card = styled(Card)`
	height: 376px;
	margin-bottom: 20px;
	display: flex;
`

const S_ChartContainer = styled.div`
	height: 100%;
	width: 45%;
`

const S_TableCard = styled(Card)`
	margin-bottom: 20px;
	overflow: scroll;
	padding-bottom: unset;
`

const S_RowCount = styled.span`
	font-size: var(--fs-desktopM1);
	font-weight: var(--fw-semibold);
	margin-bottom: 20px;
	margin-left: 10px;
	display: inline-block;
`

const S_PagingRow = styled.div`
	display: flex;
	justify-content: space-between;
`

const S_TableChartSection = styled.section`
	padding: 10px 30px 0;
	overflow: auto;
	height: calc(100vh - 3.643em);
`

export const ChartSection = () => {
	return (
		<section id="charts">
			<S_Card>
				<S_ChartContainer>
					<PieChart />
				</S_ChartContainer>
				<S_ChartContainer>
					<BarChart />
				</S_ChartContainer>
			</S_Card>
		</section>
	)
}

export const TableSection = () => {
	return (
		<section>
			<S_TableCard>
				<TableActionButtons />
				<S_PagingRow>
					<S_RowCount>{`Showing ${rows.length} of ${rows.length} rows`}</S_RowCount>
					<TablePagingButtons />
				</S_PagingRow>
				<Table mineUrl={mineUrl} rows={rows} />
			</S_TableCard>
		</section>
	)
}

export const TableChartSection = () => {
	return (
		<S_TableChartSection id="Tablechart">
			<ChartSection />
			<TableSection />
		</S_TableChartSection>
	)
}
