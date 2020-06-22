import { Card, H1 } from '@blueprintjs/core'
import { styled } from 'linaria/react'
import React from 'react'

const Chart = styled(Card)`
	height: 380px;
	margin-bottom: 20px;
`

const S = {
	Chart,
}

export const ChartSection = () => {
	return (
		<section id="Chart">
			<S.Chart>
				<H1>Chart goes here</H1>
			</S.Chart>
		</section>
	)
}
