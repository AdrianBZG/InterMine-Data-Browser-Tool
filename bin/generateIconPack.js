const { IconSvgPaths16: Icons16 } = require('@blueprintjs/icons/lib/cjs/generated/iconSvgPaths.js')
const fs = require('fs')
const path = require('path')
const { usedIcons } = require('../src/blueprintIcons')

const IconSvgPaths16 = {}
const IconSvgPaths20 = {}

const extractIcons = () => {
	usedIcons.forEach((icon) => {
		IconSvgPaths16[icon] = Icons16[icon]
		IconSvgPaths20[icon] = Icons16[icon]
	})

	fs.writeFileSync(
		path.join(__dirname, '..', 'node_modules', '@blueprintjs', 'ICON_HACK.js'),
		`export const IconSvgPaths16 = ${JSON.stringify(IconSvgPaths16)}
	export const IconSvgPaths20 = ${JSON.stringify(IconSvgPaths16)}; `
	)
}

extractIcons()

exports.extractIcons = extractIcons
