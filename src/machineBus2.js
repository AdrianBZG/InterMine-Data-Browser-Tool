import { useMachine } from '@xstate/react'
import { createContext, useContext, useMemo } from 'react'

const serviceStations = new Map()

/**
 * Interprets a machine and registers it on the service bus.
 * If a machine is provided through the MockMachineContext, it will
 * use that machine instead.
 *
 
 * @param { import('xstate').StateMachine} machine
 * @returns {[import('xstate').State, typeof sendToBus, import('xstate').Interpreter]}
 */
export const useMachineBus = (machine, opts = {}) => {
	const [machineState, , service] = useMachine(machine, opts)

	const sendToBusWrapper = useMemo(() => {
		return (event, payload) => {
			const receiver = serviceStations.get(event?.to ? event.to : service.sessionId)

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
 * @param {?} event - a string or event object (see https://xstate.js.org/docs/guides/events.html#events)
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

export const ServiceContext = createContext(null)
export const useServiceContext = () => {
	const service = useContext(ServiceContext)
	if (!service) {
		throw Error('You MUST have a ServiceContext up the tree from this component')
	}

	return [service.state, service.send]
}
