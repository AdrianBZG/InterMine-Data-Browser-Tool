import { styled } from 'linaria/react'
import React from 'react'

import * as Constraints from '../Constraints'
import { QueryController } from '../QueryController'

const S_Constraint = styled.li`
	margin: 0.875em 0;
`

const S_ConstraintList = styled.ul`
	overflow: auto;
	list-style: none;
	padding: 0;
	height: 77vh;
`

const S_ConstraintSection = styled.section`
	min-width: 230px;
	border-right: 2px solid var(--blue5);
	background-color: var(--solidWhite);
`

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
		<S_ConstraintSection>
			<QueryController />
			<S_ConstraintList>
				{constraintMocks.map((c, idx) => (
					<S_Constraint key={idx}>{Constraints.renderConstraint(c)}</S_Constraint>
				))}
			</S_ConstraintList>
		</S_ConstraintSection>
	)
}
