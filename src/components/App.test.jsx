import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import { App } from './App'

test('renders learn react link', () => {
	const { getByText } = render(<App />)
	const linkElement = getByText(/learn react/i)
	expect(linkElement).toBeInTheDocument()
})

it('should demonstrate this matcher`s usage with react', async () => {
	render(<App />, document.body)
	const results = await axe(document.body)
	expect(results).toHaveNoViolations()
})

test('runs a normal jest test', () => {
	expect(true).toBe(true)
})
