module.exports = {
	plugins: ['stylelint-declaration-block-no-ignored-properties'],
	extends: [
		'stylelint-config-recommended',
		'stylelint-config-prettier',
		'stylelint-a11y/recommended',
		'stylelint-8-point-grid',
		'linaria/stylelint-config',
	],
	rules: {
		'selector-pseudo-class-no-unknown': [
			null,
			{
				ignorePseudoClasses: ['/^global$/'],
			},
		],
		'a11y/content-property-no-static-value': true,
		'a11y/font-size-is-readable': true,
		'a11y/no-display-none': true,
		'a11y/no-obsolete-attribute': true,
		'a11y/no-obsolete-element': true,
		'a11y/no-text-align-justify': true,
		'plugin/8-point-grid': {
			base: 4,
			whitelist: ['1px'],
		},
		'plugin/declaration-block-no-ignored-properties': true,
	},
}
