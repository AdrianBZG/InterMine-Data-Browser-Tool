// query controller
export const DELETE_QUERY_CONSTRAINT = 'queryController/constraint/delete'
export const ADD_QUERY_CONSTRAINT = 'queryController/constraint/add'

// organism
export const ADD_ORGANISM_CONSTRAINT = 'organism/constraint/add'
export const APPLY_ORGANISM_CONSTRAINT = 'organism/constraint/apply'
export const REMOVE_ORGANISM_CONSTRAINT = 'organism/constraint/remove'
export const REMOVE_ALL_ORGANISM_CONSTRAINTS = 'organism/constraint/remove_all'

// global
export const LOCK_CONSTRAINTS = 'global/contraint/limit_reached'
export const REMOVE_ALL_CONSTRAINTS = 'global/constraint/remove_all'
export const RECEIVE_SUMMARY = 'global/fetch/receive_summary'

// checkboxes
export const generateCheckboxActions = (id) => {
	return {
		ADD_ORGANISM_CONSTRAINT: `machine-${id}/constraint/add`,
		APPLY_ORGANISM_CONSTRAINT: `machine-${id}/constraint/apply`,
		REMOVE_ORGANISM_CONSTRAINT: `machine-${id}/constraint/remove`,
		REMOVE_ALL_ORGANISM_CONSTRAINTS: `machine-${id}/constraint/remove_all`,
	}
}
