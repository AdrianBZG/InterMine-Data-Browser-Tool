/**
 * global - can be used by anyone
 */
export const RECEIVE_SUMMARY = 'global/fetch/receive_summary'
export const FETCH_UPDATED_SUMMARY = 'global/fetch/updated_summary'
export const FETCH_INITIAL_SUMMARY = 'global/fetch/initial_summary'

export const LOCK_ALL_CONSTRAINTS = 'global/contraint/limit_reached'
export const RESET_ALL_CONSTRAINTS = 'global/constraint/remove_all'
export const APPLY_OVERVIEW_CONSTRAINT_TO_QUERY = 'global/constraint/addToQuery'
export const DELETE_OVERVIEW_CONSTRAINT_FROM_QUERY = 'global/constraint/deleteQuery'
export const UNSET_CONSTRAINT = 'global/constraint/unset'

export const SET_AVAILABLE_COLUMNS = 'global/table/set_columns'

/**
 * query controller
 */
export const DELETE_QUERY_CONSTRAINT = 'queryController/constraint/delete'
export const ADD_QUERY_CONSTRAINT = 'queryController/constraint/add'
export const RESET_QUERY_CONTROLLER = 'queryController/constraint/reset'

/**
 * constraints
 */
export const ADD_CONSTRAINT = 'constraintFactory/add'
export const REMOVE_CONSTRAINT = 'constraintFactory/remove'
export const APPLY_DATA_BROWSER_CONSTRAINT = 'constraintFactory/apply'
export const RESET_LOCAL_CONSTRAINT = 'constraintFactory/reset'
export const FETCH_CONSTRAINT_ITEMS = 'constraintFactory/init'
export const ADD_TEMPLATE_CONSTRAINT = 'constraint/template/add'
export const TEMPLATE_CONSTRAINT_UPDATED = 'constraint/template/updated'

/**
 * Pie Chart
 */
export const SET_INITIAL_ORGANISMS = 'pieChart/fetch/initial'

/**
 * AppManager
 */
export const CHANGE_MINE = 'appManager/mine/change'
export const CHANGE_CLASS = 'appManager/class/change'
export const TOGGLE_CATEGORY_VISIBILITY = 'appManager/category/visibility'
export const TOGGLE_VIEW_IS_LOADING = 'appManager/view/isLoading'
export const ADD_LIST_CONSTRAINT = 'appManager/lists/add'
export const REMOVE_LIST_CONSTRAINT = 'appManager/lists/remove'
export const SET_API_TOKEN = 'appManager/api/token'

/**
 * Table
 */
export const CHANGE_PAGE = 'table/page/change'

export const UPDATE_TEMPLATE_QUERIES = 'templateView/templates/update'

/**
 * Constraint Section
 */
export const ADD_LIST_TAG = 'constraintSection/listTag/add'
export const REMOVE_LIST_TAG = 'constraintSection/listTag/remove'
