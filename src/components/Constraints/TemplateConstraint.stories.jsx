import React from 'react'

import { templateConstraintStub } from '../../stubs/templateConstraint'
import { constraintButtonDecorator } from '../../utils/storybook'
import { TemplateConstraint } from './TemplateConstraint'
export default {
	title: 'Components/TemplateConstraint',
	decorators: [...constraintButtonDecorator],
}

export const Constraint = () => (
	<TemplateConstraint
		classView="Gene"
		rootUrl="https://alpha.flymine.org/alpha/service"
		template={templateConstraintStub}
	/>
)
