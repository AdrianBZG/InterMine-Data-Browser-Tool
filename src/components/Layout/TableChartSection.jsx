import { Card } from '@blueprintjs/core'
import { styled } from 'linaria/react'
import React from 'react'

import { ChartSection } from './ChartSection'
import { TableSection } from './TableSection'

const StyledTableChartsSection = styled.section`
	padding: 10px 30px 0;
	overflow: auto;
	height: calc(100vh - 3.643em);
`

const S = {
	TableChartSection: StyledTableChartsSection,
}

export const TableChartSection = () => {
	return (
		<S.TableChartSection id="Tablechart">
			<ChartSection />
			<TableSection />
		</S.TableChartSection>
	)
}
