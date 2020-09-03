export const operationsDict = {
	'=': '=',
	'==': '==',
	eq: '=',
	eqq: '==',
	'!=': '!=',
	ne: '!=',
	'>': '>',
	gt: '>',
	'>=': '>=',
	ge: '>=',
	'<': '<',
	lt: '<',
	'<=': '<=',
	le: '<=',
	contains: 'CONTAINS',
	CONTAINS: 'CONTAINS',
	'does not contain': 'DOES NOT CONTAIN',
	'DOES NOT CONTAIN': 'DOES NOT CONTAIN',
	like: 'LIKE',
	LIKE: 'LIKE',
	'not like': 'NOT LIKE',
	'NOT LIKE': 'NOT LIKE',
	lookup: 'LOOKUP',
	'IS NULL': 'IS NULL',
	'is null': 'IS NULL',
	'IS NOT NULL': 'IS NOT NULL',
	'is not null': 'IS NOT NULL',
	'ONE OF': 'ONE OF',
	'one of': 'ONE OF',
	'NONE OF': 'NONE OF',
	'none of': 'NONE OF',
	in: 'IN',
	'not in': 'NOT IN',
	IN: 'IN',
	'NOT IN': 'NOT IN',
	WITHIN: 'WITHIN',
	within: 'WITHIN',
	OVERLAPS: 'OVERLAPS',
	overlaps: 'OVERLAPS',
	'DOES NOT OVERLAP': 'DOES NOT OVERLAP',
	'does not overlap': 'DOES NOT OVERLAP',
	OUTSIDE: 'OUTSIDE',
	outside: 'OUTSIDE',
	ISA: 'ISA',
	isa: 'ISA',
}

export const isSingleSelection = Object.keys(operationsDict).filter((key) => {
	const value = operationsDict[key]

	switch (value) {
		case '=':
		case '==':
		case 'eq':
		case 'eqq':
		case '!=':
		case 'ne':
			return true
		default:
			return false
	}
})

export const isMultiSelection = Object.keys(operationsDict).filter((key) => {
	const value = operationsDict[key]

	switch (value) {
		case 'ONE OF':
		case 'NONE OF':
			return true
		default:
			return false
	}
})

export const fetchableConstraintOps = [...isSingleSelection, ...isMultiSelection]
