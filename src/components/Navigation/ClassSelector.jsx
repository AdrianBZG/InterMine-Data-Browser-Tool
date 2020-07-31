import { Button, Menu, MenuItem } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Select } from '@blueprintjs/select'
import React, { useEffect, useRef } from 'react'
import { buildSearchIndex } from 'src/buildSearchIndex'
import { pluralizeFilteredCount } from 'src/utils'

import { NumberedSelectMenuItems } from '../Shared/Selects'
/**
 *
 */
const renderMenu = ({ filteredItems, itemsParentRef, query, renderItem }) => {
	const renderedItems = filteredItems.map(renderItem)
	const infoText = pluralizeFilteredCount(filteredItems, query)

	return (
		<Menu ulRef={itemsParentRef}>
			<MenuItem disabled={true} text={infoText} />
			{renderedItems}
		</Menu>
	)
}

export const ClassSelector = ({ handleClassSelect, modelClasses, classView, mineName }) => {
	const classSearchIndex = useRef(null)

	const classDisplayName =
		modelClasses.find((model) => model.name === classView)?.displayName ?? 'Gene'

	useEffect(() => {
		const indexClasses = async () => {
			if (modelClasses.length > 0) {
				classSearchIndex.current = await buildSearchIndex({
					docId: 'name',
					docField: 'displayName',
					values: modelClasses,
					cacheKey: `${mineName}-classSelector`,
				})
			}
		}

		indexClasses()
	}, [modelClasses, mineName])

	const filterQuery = (query, items) => {
		if (query === '' || !classSearchIndex?.current) {
			return items
		}

		// flexSearch's default result limit is set 1000, so we set it to the length of all items
		return classSearchIndex.current.search(query, modelClasses.length)
	}

	return (
		<div css={{ display: 'flex', marginLeft: 100, marginRight: 20 }}>
			<span
				// @ts-ignore
				css={{
					fontSize: 'var(--fs-desktopM2)',
					fontWeight: 'var(--fw-regular)',
					marginRight: 8,
					marginBottom: 0,
				}}
			>
				{classDisplayName}
			</span>
			<Select
				items={modelClasses}
				filterable={true}
				itemRenderer={NumberedSelectMenuItems}
				onItemSelect={handleClassSelect}
				itemListRenderer={renderMenu}
				itemListPredicate={filterQuery}
				resetOnClose={true}
			>
				<Button
					aria-label="select the views you'd like to query"
					// used to override `Blueprintjs` styles for a small button
					small={true}
					text="change view"
					alignText="left"
					rightIcon={IconNames.CARET_DOWN}
				/>
			</Select>
		</div>
	)
}
