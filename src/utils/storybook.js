import { Card } from '@blueprintjs/core'
import React from 'react'

export const popupDecorator = [
	(storyFn) => <Card css={{ maxWidth: 'fit-content', paddingTop: 8 }}>{storyFn()}</Card>,
]
