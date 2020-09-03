/**
 * Overview constraints
 */
export const LOCK_ALL_CONSTRAINTS = 'contraint/overview/limit_reached'
export const RESET_ALL_CONSTRAINTS = 'constraint/overview/remove_all'
export const CONSTRAINT_UPDATED = 'constraint/overview/unset'
export const APPLY_OVERVIEW_CONSTRAINT_TO_QUERY = 'constraint/overview/addToQuery'
export const DELETE_OVERVIEW_CONSTRAINT_FROM_QUERY = 'constraint/overview/deleteQuery'
export const APPLY_OVERVIEW_CONSTRAINT = 'constraint/overview/apply'
export const RESET_OVERVIEW_CONSTRAINT = 'constraint/overview/reset'
export const RESET_TEMPLATE_CONSTRAINT = 'constraint/template/reset'
export const ADD_CONSTRAINT = 'constraint/overview/add'
export const REMOVE_CONSTRAINT = 'constraint/overview/remove'

/**
 * Template constraints
 */
export const ADD_TEMPLATE_CONSTRAINT = 'constraint/template/add'

/**
 * Fetch
 */
export const FETCH_TEMPLATE_CONSTRAINT_ITEMS = 'fetch/template/init'
export const FETCH_SUMMARY = 'fetch/summary'
export const FETCH_DEFAULT_SUMMARY = 'fetch/initial_summary'
export const FETCH_TEMPLATE_SUMMARY = 'fetch/templateSummary'
export const FETCH_OVERVIEW_SUMMARY = 'fetch/overviewSummary'

/**
 * Lists
 */
export const ADD_LIST_TO_OVERVIEW = 'appManager/lists/add_to_overview'
export const REMOVE_LIST_FROM_OVERVIEW = 'appManager/lists/remove_from_overview'

export const ADD_LIST_TO_TEMPLATE = 'appManager/lists/add_to_templateView'
export const REHYDRATE_LIST_TO_TEMPLATE = 'appManager/lists/rehydrate_to_templateView'
export const REMOVE_LIST_FROM_TEMPLATE = 'appManager/lists/remove_from_templateView'

/**
 * AppManager
 */
export const CHANGE_MINE = 'appManager/mine/change'
export const CHANGE_CLASS = 'appManager/class/change'
export const TOGGLE_CATEGORY_VISIBILITY = 'appManager/category/visibility'
export const SET_API_TOKEN = 'appManager/api/token'
export const RESET_VIEW = 'appManager/reset/overview'
export const RESET_OVERVIEW = 'appManager/reset/overview'
export const RESET_TEMPLATE_VIEW = 'appManager/reset/templateView'
export const TOGGLE_VIEW = 'appManager/view/toggle'

/**
 * Table
 */
export const CHANGE_PAGE = 'table/page/change'
export const SET_AVAILABLE_COLUMNS = 'table/set_columns'

/**
 * Plots
 */
export const UPDATE_OVERVIEW_PLOTS = 'update_overview_plots'
export const UPDATE_TEMPLATE_PLOTS = 'update_template_plots'
export const RESET_PLOTS = 'reset_chart_query'
export const RESET_PLOTS_TO_DEFAULT = 'reset_chart_initial'
