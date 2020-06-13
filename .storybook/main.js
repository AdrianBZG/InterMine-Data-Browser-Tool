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
	stories: [
		'../docs/intro.story.mdx',
		'../docs/getting-started/*.story.mdx',
		'../src/**/*.story.jsx',
	],
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
