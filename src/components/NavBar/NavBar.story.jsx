import React from 'react'

import { NavigationBar } from './NavBar'
export default {
	title: 'Components/Navigation',
}

export const Navbar = () => <NavigationBar />
Navbar.parameters = {
	docs: {
		storyDescription:
			'Provides a means to set up the application for running queries or setting a theme',
	},
}
