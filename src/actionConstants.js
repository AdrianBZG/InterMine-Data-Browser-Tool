/**
 * global - can be used by anyone
 */
export const RECEIVE_SUMMARY = 'global/fetch/receive_summary'

export const LOCK_ALL_CONSTRAINTS = 'global/contraint/limit_reached'
export const RESET_ALL_CONSTRAINTS = 'global/constraint/remove_all'
export const APPLY_CONSTRAINT_TO_QUERY = 'global/constraint/addQuery'
export const DELETE_CONSTRAINT_FROM_QUERY = 'global/constraint/deleteQuery'
export const UNSET_CONSTRAINT = 'global/constraint/unset'

/**
 * query controller
 */
export const DELETE_QUERY_CONSTRAINT = 'queryController/constraint/delete'
export const ADD_QUERY_CONSTRAINT = 'queryController/constraint/add'

/**
 * constraints
 */
export const ADD_CONSTRAINT = 'checkbox/constraint/add'
export const REMOVE_CONSTRAINT = 'checkbox/constraint/remove'
export const APPLY_CONSTRAINT = 'checkbox/constraint/apply'
export const RESET_LOCAL_CONSTRAINT = 'checkbox/constraint/reset'
