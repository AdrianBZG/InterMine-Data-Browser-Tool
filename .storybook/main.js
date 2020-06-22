const globImporter = require('node-sass-glob-importer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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

		config.module.rules.push({
			test: /\.scss$/,
			use: [
				{
					loader: 'sass-loader',
					options: {
						sassOptions: {
							importer: globImporter(),
						},
					},
				},
			],
		})

		return config
	},
}
