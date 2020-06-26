const CracoLinariaPlugin = require('craco-linaria')
const { when, whenDev, whenProd } = require('@craco/craco')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const { NormalModuleReplacementPlugin } = require('webpack')
const { extractIcons } = require('./bin/generateIconPack')
const path = require('path')

module.exports = {
	webpack: {
		plugins: [
			...whenProd(() => {
				// ICON hack for blueprintjs
				extractIcons()

				return [
					new NormalModuleReplacementPlugin(
						/.*\/generated\/iconSvgPaths.*/,
						path.join(__dirname, 'node_modules', '@blueprintjs', 'ICON_HACK.js')
					),
				]
			}, []),
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
		],
	},
	plugins: [
		{
			plugin: CracoLinariaPlugin,
		},
	],
}
