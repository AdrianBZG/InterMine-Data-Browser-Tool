import React from 'react'

import { ConstraintSection as Constraints } from './ConstraintSection'
import { TableChartSection } from './DataVizSection'
import { Header as HeaderComp } from './Header'

export default {
	title: 'Components/Layout Sections',
	parameters: {
		componentSubtitle: 'Layout Sections are html section groupings of components',
	},
}

export const Header = () => <HeaderComp />
Header.storyName = 'Header Section'

export const DataVizSection = () => <TableChartSection />
DataVizSection.storyName = 'Charts and Table Section'
DataVizSection.parameters = {
	docs: {
		storyDescription:
			'The Charts and Table section display the results of a query and its associated summaries',
	},
}

export const ConstraintSection = () => (
	<div css={{ maxWidth: 200 }}>
		<Constraints />
	</div>
)

ConstraintSection.parameters = {
	docs: {
		storyDescription:
			'The constraint section manages applying and removing constraints. As well as running queries',
	},
}
