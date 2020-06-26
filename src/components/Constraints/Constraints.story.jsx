import React from 'react'

import * as Constraints from './'
import { Constraint } from './ConstraintBase'

export default {
	title: 'Components/Constraint',
	parameters: {
		componentSubtitle:
			'The Constraint component filters applies a filter to the class being queried',
	},
	decorators: [(storyFn) => <div style={{ maxWidth: '320px' }}>{storyFn()}</div>],
}

export const ExampleConstraint = () => (
	<Constraint
		constraintName="Example Constraint"
		labelText="EC"
		constraintCount={0}
		labelBorderColor="red"
	/>
)

export const NoConstraint = () => (
	<Constraint
		constraintName="No Constraint Added"
		labelText="NC"
		constraintCount={0}
		labelBorderColor="red"
	/>
)

export const OneConstraint = () => (
	<Constraint
		constraintName="One Constraint Added"
		labelText="OC"
		constraintCount={1}
		labelBorderColor="red"
	/>
)

export const MultipleConstraints = () => (
	<Constraint
		constraintName="Multiple Constraints Added"
		labelText="MC"
		constraintCount={2}
		labelBorderColor="red"
	/>
)

const placeholderDesc = {
	docs: {
		storyDescription: '**TODO:** Describe purpose of this constraint',
	},
}

export const IntermineList = () => <Constraints.IntermineList />
IntermineList.parameters = placeholderDesc

export const Symbol = () => <Constraints.SymbolConstraint />
Symbol.parameters = placeholderDesc

export const Name = () => <Constraints.Name />
Name.parameters = placeholderDesc

export const Identifiers = () => <Constraints.Identifiers />
Identifiers.parameters = placeholderDesc

export const Length = () => <Constraints.Length />
Length.parameters = placeholderDesc

export const Organism = () => <Constraints.Organism />
Organism.parameters = placeholderDesc

export const PathwayName = () => <Constraints.PathwayName />
PathwayName.parameters = placeholderDesc

export const GOAnnotation = () => <Constraints.GOAnnotation />
GOAnnotation.parameters = placeholderDesc

export const Expression = () => <Constraints.Expression />
Expression.parameters = placeholderDesc

export const Interactions = () => <Constraints.Interactions />
Interactions.parameters = placeholderDesc

export const Diseases = () => <Constraints.Diseases />
Diseases.parameters = placeholderDesc

export const ClinVar = () => <Constraints.ClinVar />
ClinVar.parameters = placeholderDesc

export const ProteinDomainName = () => <Constraints.ProteinDomainName />
ProteinDomainName.parameters = placeholderDesc

export const Phenotype = () => <Constraints.Phenotype />
Phenotype.parameters = placeholderDesc

export const DatasetName = () => <Constraints.DatasetName />
DatasetName.parameters = placeholderDesc
