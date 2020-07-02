import { Card } from '@blueprintjs/core'
import React from 'react'

export const popupDecorator = [(storyFn) => <Card css={{ maxWidth: 500 }}>{storyFn()}</Card>]
