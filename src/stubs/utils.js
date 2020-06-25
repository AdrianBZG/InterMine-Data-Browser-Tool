export const mineUrl = 'https://www.humanmine.org/humanmine'

export const geneQueryStub = {
	constraintLogic:
		'(A OR B OR C OR D OR E OR F OR G OR H OR I OR J) AND (K) AND (L) AND (M) AND (N) AND (O) AND (P) AND (Q) AND (R) AND (O AND S) AND (T AND U AND V) AND (W AND X AND Y AND Z)',
	from: 'Gene',
	select: ['primaryIdentifier'],
	model: {
		name: 'genomic',
	},
	where: [],
}

export const geneLengthQueryStub = {
	constraintLogic:
		'(A OR B OR C OR D OR E OR F OR G OR H OR I OR J) AND (K) AND (L) AND (M) AND (N) AND (O) AND (P) AND (Q) AND (R) AND (O AND S) AND (T AND U AND V) AND (W AND X AND Y AND Z)',
	from: 'Gene',
	select: ['length', 'primaryIdentifier'],
	model: {
		name: 'genomic',
	},
	where: [],
	orderBy: [
		{
			path: 'length',
			direction: 'ASC',
		},
	],
}
