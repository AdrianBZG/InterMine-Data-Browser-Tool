const CracoLinariaPlugin = require('craco-linaria')
const { when, whenDev, whenProd } = require('@craco/craco')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const { NormalModuleReplacementPlugin } = require('webpack')
const path = require('path')

module.exports = {
	webpack: {
		plugins: [
			...when(Boolean(process.env.ANALYZE), () => [new BundleAnalyzerPlugin()], []),
			...whenDev(
				() => [
					new StyleLintPlugin({
						configBasedir: __dirname,
						context: path.resolve(__dirname, 'src'),
						files: ['**/*.jsx'],
						// allow errors to still compile during development
						emitWarning: true,
					}),
				],
				[]
			),
			...whenProd(
				() => [
					new NormalModuleReplacementPlugin(
						/.*\/generated\/iconSvgPaths.js/,
						path.resolve(__dirname, 'src/blueprintjsIcons.js')
					),
				],
				[]
			),
		],
	},
	plugins: [
		{
			plugin: CracoLinariaPlugin,
		},
	],
}
