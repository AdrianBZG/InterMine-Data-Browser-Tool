import { useMachine } from '@xstate/react'
import { createContext, useContext } from 'react'

const enableMocks =
	process.env.NODE_ENV?.toLowerCase() === 'development' ||
	process.env.STORYBOOK_USEMOCK?.toLowerCase() === 'true'

export const MockMachineContext = createContext(null)

const interpretedMachines = new Set()

/**
 * Sends a message to the service bus. Only the active services
 * who are registered for the event will act.
 *
 * @param {?} event - a string or event object (see https://xstate.js.org/docs/guides/events.html#events)
 * @param {import('xstate').EventData} [payload] - the payload for the event
 */
const sendToBus = (event, payload) => {}

/**
 * Interprets a machine and registers it on the service bus.
 * If a machine is provided through the MockMachineContext, it will
 * use that machine instead.
 *
 *
 * @param { import('xstate').StateMachine} machine
 * @returns {[import('xstate').State, typeof sendToBus, import('xstate').Interpreter]}
 */
export const useMachineBus = (machine) => {
	let machineToInterpret = machine

	if (enableMocks) {
		// We only use this during development or storybook configs, so it's
		// safe to use inside the conditional here. It will either always be
		// called, or not called at all.
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const machineMock = useContext(MockMachineContext)

		if (machineMock?.id === machine.id) {
			machineToInterpret = machineMock
		}
	}

	const [state, , service] = useMachine(machineToInterpret)
	interpretedMachines.add(service)

	return [state, sendToBus, service]
}
