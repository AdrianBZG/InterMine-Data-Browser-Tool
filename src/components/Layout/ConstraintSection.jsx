import React from 'react'

import * as Constraints from '../Constraints'
import { QueryController } from '../QueryController'

const constraintMocks = [
	Constraints.INTERMINE_LIST,
	Constraints.SYMBOL_CONSTRAINT,
	Constraints.ORGANISM,
	Constraints.PATHWAY_NAME,
	Constraints.GO_ANNOTATION,
	Constraints.EXPRESSSION,
	Constraints.INTERACTIONS,
	Constraints.DISEASES,
	Constraints.CLIN_VAR,
	Constraints.PROTEIN_DOMAIN_NAME,
	Constraints.DATASET_NAME,
]

export const ConstraintSection = () => {
	return (
		<section
			css={{
				minWidth: 230,
				borderRight: '2px solid var(--blue5)',
				backgroundColor: 'var(--solidWhite)',
			}}
		>
			<QueryController />
			<ul
				css={{
					overflow: 'auto',
					listStyle: 'none',
					padding: 0,
					height: '77vh',
				}}
			>
				{constraintMocks.map((c, idx) => (
					<li css={{ margin: '0.875em 0' }} key={idx}>
						{Constraints.renderConstraint(c)}
					</li>
				))}
			</ul>
		</section>
	)
}
