import { Classes, FormGroup } from '@blueprintjs/core'
import { styled } from 'linaria/react'

export const NavFormGroup = styled(FormGroup)`
	margin: unset;

	&& > label.${Classes.LABEL} {
		font-size: var(--fs-desktopM3);
		font-weight: var(--fw-light);
		line-height: 1;
	}
`
