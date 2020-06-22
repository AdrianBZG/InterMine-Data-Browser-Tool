import { Card, H1 } from '@blueprintjs/core'
import { styled } from 'linaria/react'
import React from 'react'

const Table = styled(Card)`
	height: 500px;
	margin-bottom: 20px;
`

const S = {
	Table,
}

export const TableSection = () => {
	return (
		<section>
			<S.Table>
				<H1>Table goes here</H1>
			</S.Table>
		</section>
	)
}
