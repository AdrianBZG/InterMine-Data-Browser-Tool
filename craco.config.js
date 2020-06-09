const CracoLinariaPlugin = require('craco-linaria')
const { whenDev } = require('@craco/craco')

module.exports = {
	plugins: [
		{
			plugin: CracoLinariaPlugin,
			options: {
				// use a shorter name when in production
				displayName: whenDev(() => true, false),
			},
		},
	],
}
