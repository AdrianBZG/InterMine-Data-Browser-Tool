import { Button, Classes, Divider, FormGroup, H4 } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import { Suggest } from '@blueprintjs/select'
import Fuse from 'fuse.js'
import React, { useMemo, useState } from 'react'

import { useServiceContext } from '../../machineBus'
import { PlainSelectMenuItems } from '../Selects'
import { ADD_CONSTRAINT, REMOVE_CONSTRAINT } from './actions'
import { NoValuesProvided } from './NoValuesProvided'

export const SelectPopup = ({
	nonIdealTitle = undefined,
	nonIdealDescription = undefined,
	label,
	uniqueId,
}) => {
	const [state, send] = useServiceContext('constraints')
	const { availableValues, selectedValues } = state.context

	const [matchedItems, setMatchedItems] = useState(availableValues)

	const fuse = useMemo(() => {
		const origValues = [...availableValues]

		return new Fuse(origValues, {
			keys: ['item'],
		})
	}, [availableValues])

	if (availableValues.length === 0) {
		return <NoValuesProvided title={nonIdealTitle} description={nonIdealDescription} />
	}

	let unselectedItems = matchedItems.flatMap((v) => {
		const constraint = v.item?.item ?? v.item
		const count = v.item?.count ?? v.count

		return selectedValues.includes(v.item)
			? []
			: [{ name: `${constraint} (${count})`, item: v.item }]
	})

	if (unselectedItems.length === 0) {
		unselectedItems = [{ name: 'No items match your search', item: '' }]
	}

	// Blueprintjs requires a value renderer, but we add the value directly to the
	// added constraints list when clicked
	const renderInputValue = () => ''

	const handleItemSelect = ({ item }) => {
		const constraint = item?.item ?? item

		fuse.remove((doc) => {
			return doc?.item === constraint
		})
		send({ type: ADD_CONSTRAINT, constraint })
	}

	const handleButtonClick = (constraint) => () => {
		send({ type: REMOVE_CONSTRAINT, constraint })
	}

	const handleQueryChange = (query, e) => {
		if (query === '') {
			setMatchedItems(availableValues)
		} else {
			setMatchedItems(fuse.search(query))
		}
	}

	return (
		<div>
			{selectedValues.length > 0 && (
				<>
					<H4 css={{ paddingTop: 8, marginBottom: 4 }}>
						{`${selectedValues.length > 1 ? 'Constraints' : 'Constraint'} Added`}
					</H4>
					<ul css={{ padding: '0 16px', listStyle: 'none', marginTop: 0 }}>
						{selectedValues.map((constraint) => {
							return (
								<li
									key={constraint}
									css={{
										display: 'flex',
										alignItems: 'center',
										padding: '6px 0',
									}}
								>
									<Button
										intent="danger"
										icon={IconNames.REMOVE}
										small={true}
										minimal={true}
										// We handle
										onClick={handleButtonClick(constraint)}
										aria-label={`delete ${constraint}`}
										css={{ marginRight: 4 }}
									/>
									<span css={{ fontSize: 'var(--fs-desktopM1)', display: 'inline-block' }}>
										{constraint}
									</span>
								</li>
							)
						})}
					</ul>
					<Divider />
				</>
			)}
			<FormGroup labelFor={uniqueId} label={label} css={{ paddingTop: 24 }}>
				<Suggest
					// @ts-ignore
					id={`selectPopup-${uniqueId}`}
					items={unselectedItems}
					itemRenderer={PlainSelectMenuItems}
					inputValueRenderer={renderInputValue}
					fill={true}
					onItemSelect={handleItemSelect}
					onQueryChange={handleQueryChange}
					closeOnSelect={false}
					resetOnSelect={true}
					css={{
						[`& .${Classes.INPUT}`]: {
							boxShadow:
								unselectedItems[0].name === 'No items match your search'
									? '0 0 0 1px var(--red3), 0 0 0 2px var(--red3), inset 0 0px 0px var(--red9)'
									: // Use an invalid value here so that it can default to the original styling for non-errors
									  '',
						},
					}}
				/>
			</FormGroup>
		</div>
	)
}
