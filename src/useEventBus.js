import { createContext, useContext, useEffect, useState } from 'react'

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

export const usePartialContext = (serviceRequested = null, selector) => {
	const constraintService = useContext(ConstraintServiceContext)
	const appManagerService = useContext(AppManagerServiceContext)
	const tableService = useContext(TableServiceContext)

	let service

	if (serviceRequested === 'constraints') {
		service = constraintService
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

	const [partialContext, setPartialContext] = useState(selector(service.state.context))

	useEffect(() => {
		const { unsubscribe } = service.subscribe((state) => {
			if (!state.changed) return

			setPartialContext(selector(state.context))
		})

		return () => unsubscribe()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return [partialContext, service.send, service]
}
