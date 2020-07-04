// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'

import { toHaveNoViolations } from 'jest-axe'

// make globally available for all tests
expect.extend(toHaveNoViolations)

// required since it uses `document.createRange`
jest.mock(
	'popper.js',
	() =>
		class Popper {
			static placements = [
				'auto',
				'auto-end',
				'auto-start',
				'bottom',
				'bottom-end',
				'bottom-start',
				'left',
				'left-end',
				'left-start',
				'right',
				'right-end',
				'right-start',
				'top',
				'top-end',
				'top-start',
			]

			constructor() {
				return {
					destroy: () => {},
					scheduleUpdate: () => {},
				}
			}
		}
)
