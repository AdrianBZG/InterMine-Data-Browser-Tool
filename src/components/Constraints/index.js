/* eslint-disable default-case */
import React from 'react'

import { ClinVar } from './ClinVar'
import { DatasetName } from './DatasetName'
import { Diseases } from './Diseases'
import { Expression } from './Expression'
import { GOAnnotation } from './GOAnnotation'
import { Identifiers } from './Identifiers'
import { Interactions } from './Interactions'
import { IntermineList } from './IntermineList'
import { Length } from './Length'
import { Name } from './Name'
import { Organism } from './Organism'
import { PathwayName } from './PathwayName'
import { Phenotype } from './Phenotype'
import { ProteinDomainName } from './ProteinDomainName'
import { SymbolConstraint } from './Symbol'

export {
	ClinVar,
	DatasetName,
	Diseases,
	Expression,
	GOAnnotation,
	Identifiers,
	Interactions,
	IntermineList,
	Length,
	Name,
	Organism,
	PathwayName,
	Phenotype,
	ProteinDomainName,
	SymbolConstraint,
}

export const CLIN_VAR = 'clin_var'
export const DATASET_NAME = 'datasetname'
export const DISEASES = 'diseases'
export const EXPRESSSION = 'expression'
export const GO_ANNOTATION = 'go_annotation'
export const IDENTIFIERS = 'identifiers'
export const INTERACTIONS = 'interactions'
export const INTERMINE_LIST = 'intermine_list'
export const LENGTH = 'length'
export const NAME = 'name'
export const ORGANISM = 'Organism'
export const PATHWAY_NAME = 'pathway_name'
export const PHENOTYPE = 'phenotype'
export const PROTEIN_DOMAIN_NAME = 'protein_domain_name'
export const SYMBOL_CONSTRAINT = 'symbol_constraint'

export const renderConstraint = (constraint) => {
	switch (constraint) {
		case CLIN_VAR:
			return <ClinVar />
		case DATASET_NAME:
			return <DatasetName />
		case DISEASES:
			return <Diseases />
		case EXPRESSSION:
			return <Expression />
		case GO_ANNOTATION:
			return <GOAnnotation />
		case IDENTIFIERS:
			return <Identifiers />
		case INTERACTIONS:
			return <Interactions />
		case INTERMINE_LIST:
			return <IntermineList />
		case LENGTH:
			return <Length />
		case NAME:
			return <Name />
		case ORGANISM:
			return <Organism />
		case PATHWAY_NAME:
			return <PathwayName />
		case PHENOTYPE:
			return <Phenotype />
		case PROTEIN_DOMAIN_NAME:
			return <ProteinDomainName />
		case SYMBOL_CONSTRAINT:
			return <SymbolConstraint />
	}
}
