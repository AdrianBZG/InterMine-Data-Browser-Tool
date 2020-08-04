import { createContext, useContext } from 'react'

export const MockMachineContext = createContext(null)
export const ConstraintServiceContext = createContext(null)
export const QueryServiceContext = createContext(null)
export const AppManagerServiceContext = createContext(null)
export const TableServiceContext = createContext(null)

const serviceStations = new Set()

/**
 * Sends a message to all services on the bus. Only the active services
 * who are registered for the event will act.
 *
 * @param {import('./types').ConstraintEvents} event - a string or event object (see https://xstate.js.org/docs/guides/events.html#events)
 * @param {import('xstate').EventData} [payload] - the payload for the event
 */
export const sendToBus = (event, payload) => {
	// istanbul ignore
	serviceStations.forEach((s) => {
		if (s.machine.handles(event)) {
			s.send(event, payload)
		}
	})
}

/**
 *
 */
export const useEventBus = (service) => {
	if (service) {
		serviceStations.add(service)

		service.onStop(() => {
			serviceStations.delete(service)
		})
	}

	return [sendToBus]
}

export const useServiceContext = (serviceRequested = null) => {
	const constraintService = useContext(ConstraintServiceContext)
	const queryService = useContext(QueryServiceContext)
	const appManagerService = useContext(AppManagerServiceContext)
	const tableService = useContext(TableServiceContext)

	let service

	if (serviceRequested === 'constraints') {
		service = constraintService
	}

	if (serviceRequested === 'queryController') {
		service = queryService
	}

	if (serviceRequested === 'appManager') {
		service = appManagerService
	}

	if (serviceRequested === 'table') {
		service = tableService
	}

	if (!service) {
		throw Error('You MUST have a ServiceContext up the tree from this component')
	}

	return [service.state, service.send]
}
