const { NormalModuleReplacementPlugin } = require('webpack')
const { getLoaders, loaderByName } = require('@craco/craco')
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
		const { hasFoundAny, matches } = getLoaders(config, loaderByName('babel-loader'))

		if (hasFoundAny) {
			const cssPlugin = require.resolve('@emotion/babel-preset-css-prop')
			matches.forEach((match) => {
				if (!match.loader.options.presets.includes(cssPlugin)) {
					match.loader.options.presets.push(cssPlugin)
				}
			})
		}

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
