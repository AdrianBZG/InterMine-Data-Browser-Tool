module.exports = {
	addons: [
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
}
