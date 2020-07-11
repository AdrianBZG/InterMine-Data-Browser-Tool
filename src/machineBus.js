import { useMachine } from '@xstate/react'
import { createContext, useContext, useMemo } from 'react'

const enableMocks =
	// istanbul ignore
	process.env.NODE_ENV?.toLowerCase() === 'development' ||
	process.env.NODE_ENV?.toLowerCase() === 'test' ||
	process.env.STORYBOOK_USEMOCK?.toLowerCase() === 'true'

const serviceStations = new Map()
export const MockMachineContext = createContext(null)
export const ConstraintServiceContext = createContext(null)
export const QueryServiceContext = createContext(null)
export const SupervisorServiceContext = createContext(null)

/** @type {import('./types').UseMachineBus} */
export const useMachineBus = (machine, opts = {}) => {
	const mockMachine = useContext(MockMachineContext)
	let activeMachine = machine

	if (enableMocks && mockMachine) {
		// istanbul ignore
		if (mockMachine?.id === machine.id) {
			activeMachine = mockMachine
		}
	}

	const [machineState, , service] = useMachine(activeMachine, opts)

	/** @type {import('./types').SendToBusWrapper} */
	const sendToBusWrapper = useMemo(() => {
		return (event, payload) => {
			const receiver = serviceStations.get(service.sessionId)

			if (receiver) {
				receiver.send(event, payload)
			} else {
				const e = new Error()
				e.name = 'MessageBus'
				e.message = 'Could not locate a service in the bus stations'
				throw e
			}
		}
	}, [service.sessionId])

	const existing = serviceStations.get(service.sessionId)

	if (!existing) {
		serviceStations.set(service.sessionId, service)
	}

	return [machineState, sendToBusWrapper, service]
}

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

export const useServiceContext = (serviceRequested = null) => {
	const constraintService = useContext(ConstraintServiceContext)
	const queryService = useContext(QueryServiceContext)
	const supervisorService = useContext(SupervisorServiceContext)

	let service

	if (serviceRequested === 'constraints') {
		service = constraintService
	}

	if (serviceRequested === 'queryController') {
		service = queryService
	}

	if (serviceRequested === 'supervisor') {
		service = supervisorService
	}

	if (!service) {
		throw Error('You MUST have a ServiceContext up the tree from this component')
	}

	return [service.state, service.send]
}
