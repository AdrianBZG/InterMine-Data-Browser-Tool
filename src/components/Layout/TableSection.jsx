import { Card } from '@blueprintjs/core'
import { styled } from 'linaria/react'
import React from 'react'

import { humanMine25 as rows } from '../../stubs/humanMine25'
import { mineUrl } from '../../stubs/utils'
import { Table } from '../Table/Table'
import { TableActionButtons, TablePagingButtons } from '../Table/TableButtons'

const TableCard = styled(Card)`
	margin-bottom: 20px;
	overflow: scroll;
	padding-bottom: unset;
`

const StyledRowCount = styled.span`
	font-size: var(--fs-desktopM1);
	font-weight: var(--fw-semibold);
	margin-bottom: 20px;
	margin-left: 10px;
	display: inline-block;
`

const StyledPagingRow = styled.div`
	display: flex;
	justify-content: space-between;
`

const S = {
	TableCard,
	RowCount: StyledRowCount,
	PagingRow: StyledPagingRow,
}

export const TableSection = () => {
	return (
		<section>
			<S.TableCard>
				<TableActionButtons />
				<S.PagingRow>
					<S.RowCount>{`Showing ${rows.length} of ${rows.length} rows`}</S.RowCount>
					<TablePagingButtons />
				</S.PagingRow>
				<Table mineUrl={mineUrl} rows={rows} />
			</S.TableCard>
		</section>
	)
}
