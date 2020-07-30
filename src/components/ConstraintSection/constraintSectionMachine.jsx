import { ADD_LIST_TAG, REMOVE_LIST_TAG } from 'src/eventConstants'
import { assign, Machine } from 'xstate'

const addListTag = assign({
	// @ts-ignore
	listNames: (ctx, { listName }) => {
		return [...ctx.listNames, listName]
	},
})

const removeListTag = assign({
	// @ts-ignore
	listNames: (ctx, { listName }) => {
		return ctx.listNames.filter((list) => list !== listName)
	},
})

export const constraintSectionMachine = Machine(
	{
		id: 'ConstraintSection',
		initial: 'idle',
		context: {
			listNames: [],
		},
		states: {
			idle: {
				on: {
					[REMOVE_LIST_TAG]: { actions: 'removeListTag' },
					[ADD_LIST_TAG]: { actions: 'addListTag' },
				},
			},
		},
	},
	{
		actions: {
			addListTag,
			removeListTag,
		},
	}
)
