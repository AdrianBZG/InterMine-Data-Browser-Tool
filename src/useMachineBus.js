import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { interpret, State } from 'xstate'

const enableMocks =
	// istanbul ignore
	process.env.NODE_ENV?.toLowerCase() === 'development' ||
	process.env.NODE_ENV?.toLowerCase() === 'test' ||
	process.env.STORYBOOK_USEMOCK?.toLowerCase() === 'true'

export const MockMachineContext = createContext(null)
export const ConstraintServiceContext = createContext(null)
export const QueryServiceContext = createContext(null)
export const AppManagerServiceContext = createContext(null)
export const TableServiceContext = createContext(null)

const serviceStations = new Map()

const ReactEffectType = {
	Effect: 1,
	LayoutEffect: 2,
}

const partition = (items, predicate) => {
	const [truthy, falsy] = [[], []]
	for (const item of items) {
		if (predicate(item)) {
			truthy.push(item)
		} else {
			falsy.push(item)
		}
	}

	return [truthy, falsy]
}

const executeEffect = (action, state) => {
	const { exec } = action
	const originalExec = exec(state.context, state._event.data, {
		action,
		state,
		_event: state._event,
	})

	originalExec()
}

/**
 * This is a slightly modified version of `xstate`s `useMachine` that allows components to
 * reuse an already interpreted machine. It does so by caching the service in the service station bus.
 *
 * N.B: Since the machines are **never** stopped, components are responsible for stopping them if
 * and where necessary
 */
export const useMachineBus = (machine, opts = {}) => {
	// Allows mocking tests
	const mockMachine = useContext(MockMachineContext)
	let activeMachine = machine

	if (enableMocks && mockMachine) {
		// istanbul ignore
		if (mockMachine?.id === machine.id) {
			activeMachine = mockMachine
		}
	}

	const {
		context,
		guards,
		actions,
		activities,
		services,
		delays,
		state: rehydratedState,
		...interpreterOptions
	} = opts

	const machineConfig = {
		context,
		guards,
		actions,
		activities,
		services,
		delays,
	}

	let service = serviceStations.get(activeMachine.id)
	let serviceState = service?.state

	if (!service) {
		const resolvedMachine = machine.withConfig(machineConfig, {
			...activeMachine.context,
			...context,
		})

		serviceState = rehydratedState ? State.create(rehydratedState) : resolvedMachine.initialState
		service = interpret(resolvedMachine, { deferEvents: true, ...interpreterOptions })

		serviceStations.set(activeMachine.id, service)
	}

	const [state, setState] = useState(serviceState)

	const effectActionsRef = useRef([])
	const layoutEffectActionsRef = useRef([])

	useEffect(() => {
		const handleStateChange = (currentState) => {
			const initialStateChanged =
				currentState.changed === undefined && Object.keys(currentState.children).length

			if (currentState.changed || initialStateChanged) {
				setState(currentState)
			}

			if (currentState.actions.length) {
				const reactEffectActions = currentState.actions.filter((action) => {
					return typeof action.exec === 'function' && '__effect' in action.exec
				})

				const [effectActions, layoutEffectActions] = partition(reactEffectActions, (action) => {
					return action.exec.__effect === ReactEffectType.Effect
				})

				effectActionsRef.current.push(
					...effectActions.map((effectAction) => [effectAction, currentState])
				)

				layoutEffectActionsRef.current.push(
					...layoutEffectActions.map((layoutEffectAction) => [layoutEffectAction, currentState])
				)
			}
		}

		service
			.onTransition(handleStateChange)
			.start(rehydratedState ? State.create(rehydratedState) : undefined)

		return () => service.off(handleStateChange)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Make sure actions and services are kept updated when they change.
	// This mutation assignment is safe because the service instance is only used
	// in one place -- this hook's caller.
	useEffect(() => {
		Object.assign(service.machine.options.actions, actions)
	}, [actions, service.machine.options.actions])

	useEffect(() => {
		Object.assign(service.machine.options.services, services)
	}, [service.machine.options.services, services])

	useEffect(() => {
		while (layoutEffectActionsRef.current.length) {
			const [layoutEffectAction, effectState] = layoutEffectActionsRef.current.shift()

			executeEffect(layoutEffectAction, effectState)
		}
	}, [state])

	useEffect(() => {
		while (effectActionsRef.current.length) {
			const [effectAction, effectState] = effectActionsRef.current.shift()

			executeEffect(effectAction, effectState)
		}
	}, [state])

	return [state, service.send, service]
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
