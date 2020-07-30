import {
	ADD_QUERY_CONSTRAINT,
	DELETE_QUERY_CONSTRAINT,
	SET_INITIAL_ORGANISMS,
	TOGGLE_CATEGORY_VISIBILITY,
} from 'src/eventConstants'
import { EventObject, MachineConfig, StateMachine, StateNode, StateSchema, Typestate } from 'xstate'

import {
	ADD_CONSTRAINT,
	APPLY_DATA_BROWSER_CONSTRAINT,
	REMOVE_CONSTRAINT,
	RESET_LOCAL_CONSTRAINT,
} from './components/Constraints/actions'
import { LOCK_ALL_CONSTRAINTS, RESET_ALL_CONSTRAINTS } from './globalActions'

/**
 * Constraint Machines
 */
export interface ConstraintMachineSchema extends StateSchema {
	states: {
		loading: {}
		noConstraintsSet: {}
		noConstraintItems: {}
		constraintsUpdated: {}
		constraintsApplied: {}
		constraintLimitReached: {}
	}
}

export interface ConstraintMachineContext {
	selectedValues: string[]
	availableValues: any[]
	constraintPath: string
	classView: string
	constraintItemsQuery: { [key: string]: any }
	searchIndex?: any
	type: ConstraintMachineTypes
}

export type ConstraintEvents = EventObject &
	(
		| { to?: string; type: typeof LOCK_ALL_CONSTRAINTS }
		| { to?: string; type: typeof RESET_ALL_CONSTRAINTS }
		| { to?: string; type: typeof RESET_LOCAL_CONSTRAINT }
		| { to?: string; type: typeof ADD_CONSTRAINT; constraint: string }
		| { to?: string; type: typeof REMOVE_CONSTRAINT; constraint: string }
		| { to?: string; type: typeof APPLY_DATA_BROWSER_CONSTRAINT }
		| { to?: string; type: typeof APPLY_OVERVIEW_CONSTRAINT_TO_QUERY; query: QueryConfig }
		| { to?: string; type: typeof DELETE_QUERY_CONSTRAINT; path: string }
		| { to?: string; type: typeof SET_AVAILABLE_COLUMNS; selectedPaths: string[] }
		| { to?: string; type: typeof FETCH_UPDATED_SUMMARY; query: { [key: string]: any } }
		| { to?: string; type: typeof CHANGE_CONSTRAINT_VIEW; newTabId: string | number }
		| { to?: string; type: typeof TOGGLE_CATEGORY_VISIBILITY; isVisible: boolean; tagName: string }
		| { to?: string; type: typeof ADD_TEMPLATE_CONSTRAINT; path: string; selectedValues: any[] }
		| {
				to?: string
				type: typeof SET_INITIAL_ORGANISMS
				globalConfig: { rootUrl: string; classView: string }
		  }
	)

export type ConstraintMachineConfig = MachineConfig<
	ConstraintMachineContext,
	ConstraintMachineSchema,
	ConstraintEvents
>

type ConstraintTypeState = Typestate<ConstraintMachineContext>

export type ConstraintStateMachine =
	| StateMachine<
			ConstraintMachineContext,
			ConstraintMachineSchema,
			ConstraintEvents,
			ConstraintTypeState
	  >
	| StateNode<ConstraintMachineContext, any, ConstraintEvents, any>

type ConstraintMachineTypes = 'checkbox' | 'select'

export type ConstraintMachineOpts = {
	id: ConstraintMachineTypes
	initial?:
		| 'loading'
		| 'noConstraintsSet'
		| 'noConstraintItems'
		| 'constraintsUpdated'
		| 'constraintsApplied'
		| 'constraintLimitReached'
	path?: string
	op?: ImjsOperations
	constraintItemsQuery: { [key: string]: any }
}

export type CreateConstraintMachine = (
	options: ConstraintMachineOpts
) => StateMachine<ConstraintMachineContext, any, ConstraintEvents, any>

export type ConstraintConfig = {
	type: ConstraintMachineTypes
	name: string
	label: string
	path: string
	op: string
	valuesQuery: { [key: string]: any }
}

/**
 *
 */
export type ImjsOperations = 'ONE OF'

/**
 * Query Machine
 */
export interface QueryMachineSchema extends StateSchema {
	states: {
		idle: {}
		constraintLimitReached: {}
	}
}

export interface QueryMachineContext {
	currentConstraints: QueryConfig[]
}

export type QueryConfig = {
	path: string
	values: string[]
	op: ImjsOperations
}

export type QueryMachineEvents = EventObject &
	(
		| { to?: string; type: typeof DELETE_QUERY_CONSTRAINT; constraint: QueryConfig }
		| { to?: string; type: typeof ADD_QUERY_CONSTRAINT; constraint: QueryConfig }
	)

export type QueryMachineConfig = MachineConfig<
	QueryMachineContext,
	QueryMachineSchema,
	QueryMachineEvents
>
