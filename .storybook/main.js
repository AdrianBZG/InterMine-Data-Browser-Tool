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
	stories: ['../docs/Intro.story.mdx', '../src/**/*.story.jsx'],
}
