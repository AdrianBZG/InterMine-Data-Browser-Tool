import React from 'react'

import { ConstraintServiceContext, useMachineBus } from '../../machineBus'
import { CheckboxPopup } from '../Constraints/CheckboxPopup'
import { Constraint } from '../Constraints/Constraint'
import { createConstraintMachine } from '../Constraints/createConstraintMachine'
import { SelectPopup } from '../Constraints/SelectPopup'
import { DATA_VIZ_COLORS } from '../DataViz/dataVizColors'
import { QueryController } from '../QueryController/QueryController'

/** @type {import('../../types').ConstraintConfig[]} */
const defaultConstraints = [
	{
		type: 'checkbox',
		name: 'Organism',
		label: 'Or',
		path: 'organism.shortName',
		op: 'ONE OF',
		valuesQuery: {
			select: ['primaryIdentifier'],
			model: {
				name: 'genomic',
			},
			where: [],
		},
	},
	{
		type: 'select',
		name: 'Pathway Name',
		label: 'Pn',
		path: 'pathways.name',
		op: 'ONE OF',
		valuesQuery: {
			select: ['pathways.name', 'primaryIdentifier'],
			model: {
				name: 'genomic',
			},
			orderBy: [
				{
					path: 'pathways.name',
					direction: 'ASC',
				},
			],
		},
	},
	{
		type: 'select',
		name: 'GO Annotation',
		label: 'GA',
		path: 'goAnnotation.ontologyTerm.name',
		op: 'ONE OF',
		valuesQuery: {
			select: ['goAnnotation.ontologyTerm.name', 'primaryIdentifier'],
			model: {
				name: 'genomic',
			},
			orderBy: [
				{
					path: 'goAnnotation.ontologyTerm.name',
					direction: 'ASC',
				},
			],
		},
	},
]

const ConstraintBuilder = ({ constraintConfig, color }) => {
	const { type, name, label, path, op, valuesQuery: constraintItemsQuery } = constraintConfig

	const [state, send] = useMachineBus(
		createConstraintMachine({ id: type, path, op, constraintItemsQuery })
	)

	let Popup

	switch (type) {
		case 'checkbox':
			Popup = CheckboxPopup
			break
		default:
			Popup = SelectPopup
			break
	}

	return (
		<ConstraintServiceContext.Provider value={{ state, send }}>
			<Constraint constraintIconText={label} constraintName={name} labelBorderColor={color}>
				<Popup
					nonIdealTitle="No items found"
					nonIdealDescription="If you feel this is a mistake, try refreshing the browser. If that doesn't work, let us know"
				/>
			</Constraint>
		</ConstraintServiceContext.Provider>
	)
}

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
				{defaultConstraints.map((config, idx) => (
					<li css={{ margin: '0.875em 0' }} key={idx}>
						<ConstraintBuilder
							constraintConfig={config}
							color={DATA_VIZ_COLORS[idx % DATA_VIZ_COLORS.length]}
						/>
					</li>
				))}
			</ul>
		</section>
	)
}
