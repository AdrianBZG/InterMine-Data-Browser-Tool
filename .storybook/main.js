module.exports = {
	addons: [
		'@storybook/addon-links/register',
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

		return config
	},
}
