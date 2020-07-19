/**
 * global - can be used by anyone
 */
export const RECEIVE_SUMMARY = 'global/fetch/receive_summary'
export const FETCH_UPDATED_SUMMARY = 'global/fetch/updated_summary'
export const FETCH_INITIAL_SUMMARY = 'global/fetch/initial_summary'

export const LOCK_ALL_CONSTRAINTS = 'global/contraint/limit_reached'
export const RESET_ALL_CONSTRAINTS = 'global/constraint/remove_all'
export const APPLY_CONSTRAINT_TO_QUERY = 'global/constraint/addQuery'
export const DELETE_CONSTRAINT_FROM_QUERY = 'global/constraint/deleteQuery'
export const UNSET_CONSTRAINT = 'global/constraint/unset'

export const SET_AVAILABLE_COLUMNS = 'global/table/set_columns'

/**
 * query controller
 */
export const DELETE_QUERY_CONSTRAINT = 'queryController/constraint/delete'
export const ADD_QUERY_CONSTRAINT = 'queryController/constraint/add'

/**
 * constraints
 */
export const ADD_CONSTRAINT = 'constraintFactory/add'
export const REMOVE_CONSTRAINT = 'constraintFactory/remove'
export const APPLY_CONSTRAINT = 'constraintFactory/apply'
export const RESET_LOCAL_CONSTRAINT = 'constraintFactory/reset'
export const FETCH_CONSTRAINT_ITEMS = 'constraintFactory/init'

/**
 * Pie Chart
 */
export const SET_INITIAL_ORGANISMS = 'pieChart/fetch/initial'

/**
 * Supervisor
 */
export const CHANGE_MINE = 'supervisor/mine/change'
export const CHANGE_CLASS = 'supervisor/class/change'

/**
 * Table
 */
export const CHANGE_PAGE = 'table/page/change'
