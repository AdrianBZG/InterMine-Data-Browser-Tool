import { useMachine } from '@xstate/react'
import { createContext, useContext, useMemo } from 'react'

const enableMocks =
	// istanbul ignore
	process.env.NODE_ENV?.toLowerCase() === 'development' ||
	process.env.NODE_ENV?.toLowerCase() === 'test' ||
	process.env.STORYBOOK_USEMOCK?.toLowerCase() === 'true'

export const MockMachineContext = createContext(null)

const serviceStations = new Map()

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

/**
 * Interprets a machine and registers it on the service bus.
 * If a machine is provided through the MockMachineContext, it will
 * use that machine instead.
 *
 
 * @param { import('xstate').StateMachine} machine
 * @returns {[import('xstate').State, typeof sendToBus, import('xstate').Interpreter]}
 */
export const useMachineBus = (machine, { state = undefined, ...restOptions } = {}) => {
	let mockState = state

	if (enableMocks && mockState) {
		// We only use this for storybook configs, so it's
		// safe to use inside the conditional here. It will
		// either always be called, or not called at all.
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const machineMock = useContext(MockMachineContext)

		// istanbul ignore
		if (machineMock?.id === machine.id) {
			mockState = machineMock.transition(machineMock.initialState, '')
		}
	}

	const sendToBusWrapper = useMemo(() => {
		return (event, payload) => {
			const receiver = serviceStations.get(event?.to ? event.to : machine.id)

			if (receiver) {
				receiver.send(event, payload)
			} else {
				const e = new Error()
				e.name = 'MessageBus'
				e.message = 'Could not locate a service in the bus stations'
				throw e
			}
		}
	}, [machine.id])

	// @ts-ignore
	const [machineState, , service] = useMachine(machine, { ...restOptions, state: mockState })

	const existing = serviceStations.get(machine.id)

	if (!existing) {
		serviceStations.set(machine.id, service)
	}

	return [machineState, sendToBusWrapper, service]
}
