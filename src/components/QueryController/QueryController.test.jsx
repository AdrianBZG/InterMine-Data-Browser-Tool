import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { ADD_QUERY_CONSTRAINT, DELETE_QUERY_CONSTRAINT } from '../../actionConstants'
import { MockMachineContext } from '../../machineBus'
import { QueryController } from './QueryController'
import { queryControllerMachine } from './queryControllerMachine'

describe('QueryController Machine', () => {
	it.each(['a', 'b', 'c'].map((c, idx) => [c, idx]))(
		'deletes a constraint from the current list - index %#',
		(constraint) => {
			const machine = queryControllerMachine.withContext({
				currentConstraints: ['a', 'b', 'c'],
			})

			expect(machine.context.currentConstraints).toHaveLength(3)

			const nextMachine = machine.transition(machine.initialState, {
				// @ts-ignore
				type: DELETE_QUERY_CONSTRAINT,
				constraint,
			})

			expect(nextMachine.context.currentConstraints).toHaveLength(2)
			expect(nextMachine.context.currentConstraints).toEqual(
				expect.not.arrayContaining([constraint])
			)
		}
	)

	it('adds a constraint to the current list', () => {
		const machine = queryControllerMachine.withContext({ currentConstraints: [] })

		expect(machine.context.currentConstraints).toHaveLength(0)

		const newConstraint = 'newly add constraint'
		const nextMachine = machine.transition(machine.initialState, {
			// @ts-ignore
			type: ADD_QUERY_CONSTRAINT,
			constraint: newConstraint,
		})

		expect(nextMachine.context.currentConstraints).toHaveLength(1)
		expect(nextMachine.context.currentConstraints).toEqual(expect.arrayContaining([newConstraint]))
	})

	it('prevents adding more than 26 constraints', () => {
		const machine = queryControllerMachine.withContext({
			currentConstraints: Array.from('c'.repeat(25)),
		})

		const nextMachine = machine.transition(machine.initialState, {
			// @ts-ignore
			type: ADD_QUERY_CONSTRAINT,
			contraint: 'DO NOT ADD',
		})

		expect(nextMachine.context.currentConstraints).toHaveLength(26)
		expect(nextMachine.value).toBe('constraintLimitReached')
	})
})

describe('QueryController UI', () => {
	it('displays empty state when no constraints are set', () => {
		const machine = queryControllerMachine.withContext({
			currentConstraints: [],
		})
		render(
			<MockMachineContext.Provider value={machine}>
				<QueryController />
			</MockMachineContext.Provider>
		)

		userEvent.click(screen.getByText('view all'))
		expect(screen.getByText('No Constraints applied')).toBeInTheDocument()
		expect(screen.getByText('You have no historical queries')).toBeInTheDocument()
	})

	it.skip('removes constraints when the button is clicked', async () => {
		const machine = queryControllerMachine.withContext({
			currentConstraints: ['a-constraint', 'b-constraint'],
		})

		render(
			<MockMachineContext.Provider value={machine}>
				<QueryController />
			</MockMachineContext.Provider>
		)

		userEvent.click(screen.getByText('view all'))
		userEvent.click(screen.getByLabelText(/b-constraint/))

		expect(screen.queryByText('b-constraint')).not.toBeInTheDocument()
	})
})
