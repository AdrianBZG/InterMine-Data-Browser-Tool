import { css } from 'linaria'

// hide text from visual users, but allow screenreaders and
// keyboard users to access it
export const screenreaderOnly = css`
	position: absolute !important;
	height: 1px; /* stylelint-disable-line */
	width: 1px; /* stylelint-disable-line */
	overflow: hidden;
	clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
	clip: rect(1px, 1px, 1px, 1px);
	white-space: nowrap; /* added line */
`
