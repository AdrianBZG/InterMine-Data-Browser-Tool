import { assign } from '@xstate/immer'
import FlexSearch from 'flexsearch'
import { fetchSummary } from 'src/fetchSummary'
import { sendToBus } from 'src/machineBus'
import { formatConstraintPath } from 'src/utils'
import { Machine } from 'xstate'

import {
	ADD_CONSTRAINT,
	APPLY_CONSTRAINT,
	APPLY_CONSTRAINT_TO_QUERY,
	DELETE_CONSTRAINT_FROM_QUERY,
	FETCH_INITIAL_SUMMARY,
	LOCK_ALL_CONSTRAINTS,
	REMOVE_CONSTRAINT,
	RESET_ALL_CONSTRAINTS,
	RESET_LOCAL_CONSTRAINT,
	UNSET_CONSTRAINT,
} from '../../actionConstants'

/** @type {import('../../types').CreateConstraintMachine} */
export const createConstraintMachine = ({
	id,
	initial = 'noConstraintsSet',
	path = '',
	op,
	constraintItemsQuery,
}) => {
	/** @type {import('../../types').ConstraintMachineConfig} */
	const config = {
		id,
		initial,
		context: {
			type: id,
			constraintPath: path,
			selectedValues: [],
			availableValues: [],
			classView: '',
			constraintItemsQuery,
			searchIndex: null,
		},
		on: {
			[LOCK_ALL_CONSTRAINTS]: 'constraintLimitReached',
			[RESET_ALL_CONSTRAINTS]: { target: 'noConstraintsSet', actions: 'removeAll' },
			[RESET_LOCAL_CONSTRAINT]: { target: 'noConstraintsSet', actions: 'removeAll' },
			[UNSET_CONSTRAINT]: { target: 'constraintsUpdated', cond: 'pathMatches' },
			// make a global action listener since we don't store them in local storage, and need
			// to fetch them even if the rest of the state is rehydrated.
			[FETCH_INITIAL_SUMMARY]: { target: 'init', cond: 'hasNotInitialized' },
		},
		states: {
			init: {
				invoke: {
					id: 'fetchInitialValues',
					src: 'fetchInitialValues',
					onDone: {
						target: 'noConstraintsSet',
						actions: 'setAvailableValues',
					},
					onError: {
						target: 'noConstraintsSet',
						actions: (ctx, event) => console.error(`FETCH: ${path}`, { ctx, event }),
					},
				},
			},
			noConstraintsSet: {
				entry: 'resetConstraint',
				on: {
					[ADD_CONSTRAINT]: {
						target: 'constraintsUpdated',
						actions: 'addConstraint',
					},
				},
			},
			constraintsUpdated: {
				always: [{ target: 'noConstraintsSet', cond: 'constraintListIsEmpty' }],
				on: {
					[ADD_CONSTRAINT]: { actions: 'addConstraint' },
					[REMOVE_CONSTRAINT]: { actions: 'removeConstraint' },
					[APPLY_CONSTRAINT]: { target: 'constraintsApplied', actions: 'applyConstraint' },
				},
			},
			constraintsApplied: {
				on: {
					[ADD_CONSTRAINT]: {
						target: 'constraintsUpdated',
						actions: 'addConstraint',
					},
					[REMOVE_CONSTRAINT]: {
						target: 'constraintsUpdated',
						actions: 'removeConstraint',
					},
				},
			},
			constraintLimitReached: {
				on: {
					[REMOVE_CONSTRAINT]: { actions: 'removeConstraint' },
				},
			},
		},
	}

	return Machine(config, {
		actions: {
			// @ts-ignore
			addConstraint: assign((ctx, { constraint }) => {
				ctx.selectedValues.push(constraint)
			}),
			// @ts-ignore
			removeConstraint: assign((ctx, { constraint }) => {
				ctx.selectedValues = ctx.selectedValues.filter((name) => name !== constraint)
			}),
			removeAll: assign((ctx) => {
				ctx.selectedValues = []
			}),
			// @ts-ignore
			setAvailableValues: assign((ctx, { data }) => {
				// @ts-ignore
				ctx.availableValues = data.items
				ctx.classView = data.classView

				if (ctx.type === 'select') {
					// prebuild search index for the dropdown select menu
					// @ts-ignore
					const searchIndex = new FlexSearch({
						encode: 'advanced',
						tokenize: 'reverse',
						suggest: true,
						cache: true,
					})

					data.items.forEach((item) => {
						// @ts-ignore
						searchIndex.add(item.item, item.item)
					})

					ctx.searchIndex = searchIndex
				}
			}),
			applyConstraint: ({ classView, constraintPath, selectedValues, availableValues }) => {
				const query = {
					op,
					path: formatConstraintPath({ classView, path: constraintPath }),
					values: selectedValues,
					// used to render the constraints as a list
					valuesDescription: selectedValues.map((selected) => {
						return availableValues.find((v) => v.item === selected)
					}),
				}

				sendToBus({ query, type: APPLY_CONSTRAINT_TO_QUERY })
			},
			resetConstraint: ({ classView, constraintPath }) => {
				// @ts-ignore
				sendToBus({
					type: DELETE_CONSTRAINT_FROM_QUERY,
					path: formatConstraintPath({ classView, path: constraintPath }),
				})
			},
		},
		guards: {
			constraintListIsEmpty: (ctx) => {
				return ctx.selectedValues.length === 0
			},
			// @ts-ignore
			pathMatches: (ctx, { path }) => {
				return ctx.constraintPath === path
			},
			hasNotInitialized: (ctx) => {
				return ctx.availableValues.length === 0
			},
		},
		services: {
			fetchInitialValues: async (ctx, event) => {
				const { constraintItemsQuery, constraintPath } = ctx

				const {
					globalConfig: { rootUrl, classView },
				} = event

				const query = {
					...constraintItemsQuery,
					from: classView,
				}

				const summary = await fetchSummary({ rootUrl, query, path: constraintPath })

				return {
					classView,
					items: summary.results,
				}
			},
		},
	})
}
