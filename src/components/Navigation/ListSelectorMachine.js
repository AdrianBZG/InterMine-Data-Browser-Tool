import {
	ADD_LIST_TO_OVERVIEW,
	ADD_LIST_TO_TEMPLATE,
	CHANGE_CLASS,
	CHANGE_MINE,
	REMOVE_LIST_FROM_OVERVIEW,
	REMOVE_LIST_FROM_TEMPLATE,
	RESET_OVERVIEW,
	RESET_TEMPLATE_VIEW,
} from 'src/eventConstants'
import { assign, Machine } from 'xstate'

/**
 *
 */
const assignOverviewList = assign({
	// @ts-ignore
	listForOverview: (_ctx, { displayName, listName }) => ({
		displayName,
		listName,
	}),
})

/**
 *
 */
const assignTemplateList = assign({
	// @ts-ignore
	listForTemplate: (_ctx, { displayName, listName }) => ({
		displayName,
		listName,
	}),
})

/**
 *
 */
const removeOverviewList = assign({
	listForOverview: () => {},
})

/**
 *
 */
const removeTemplateList = assign({
	listForTemplate: () => {},
})

export const ListSelectorMachine = Machine(
	{
		id: 'List Selector',
		initial: 'idle',
		context: {
			listForOverview: {
				displayName: '',
				listName: '',
			},
			listForTemplate: {
				displayName: '',
				listName: '',
			},
		},
		states: {
			idle: {
				on: {
					[ADD_LIST_TO_OVERVIEW]: { actions: 'assignOverviewList' },
					[REMOVE_LIST_FROM_OVERVIEW]: { actions: 'removeOverviewList' },
					[ADD_LIST_TO_TEMPLATE]: { actions: 'assignTemplateList' },
					[REMOVE_LIST_FROM_TEMPLATE]: { actions: 'removeTemplateList' },
					[CHANGE_MINE]: { actions: ['removeOverviewList', 'removeTemplateList'] },
					[CHANGE_CLASS]: { actions: ['removeOverviewList', 'removeTemplateList'] },
					[RESET_OVERVIEW]: { actions: 'removeOverviewList' },
					[RESET_TEMPLATE_VIEW]: { actions: 'removeTemplateList' },
				},
			},
		},
	},
	{
		actions: {
			assignOverviewList,
			assignTemplateList,
			removeOverviewList,
			removeTemplateList,
		},
	}
)
