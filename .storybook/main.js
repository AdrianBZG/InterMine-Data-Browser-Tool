const { NormalModuleReplacementPlugin } = require('webpack')
const { extractIcons } = require('../bin/generateIconPack')
const path = require('path')

module.exports = {
	addons: [
		'@storybook/addon-knobs',
		'@storybook/addon-links',
		'@storybook/preset-create-react-app',
		{
			name: '@storybook/addon-docs',
			options: {
				configureJSX: true,
			},
		},
	],
	stories: ['../README.story.mdx', '../docs/**/*.story.mdx', '../src/**/*.story.jsx'],
	webpackFinal: async (config, { configType }) => {
		config.module.rules.push({
			test: /\.jsx?$/,
			loader: 'linaria/loader',
			options: {
				sourceMap: false,
				cacheDirectory: 'src/.linaria_cache/storybook',
			},
		})

		if (configType === 'PRODUCTION') {
			// ICON hack for blueprintjs
			extractIcons()

			config.plugins.push(
				new NormalModuleReplacementPlugin(
					/.*\/generated\/iconSvgPaths.*/,
					path.join(__dirname, '..', 'node_modules', '@blueprintjs', 'ICON_HACK.js')
				)
			)
		}

		return config
	},
}
