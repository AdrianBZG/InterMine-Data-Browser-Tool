import { css } from 'linaria'

export const globals = css`
	:global() {
		:root {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
				'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

			${'' /* 
         When using light text on dark background, text appears thicker.
         Setting font smoothing fixes this.
         Setting it globally allows us to change it when light mode is on */}

			--global-font-smoothing: antialiased;
			--global-moz-font-smoothing: grayscale;

			-webkit-font-smoothing: var(--global-font-smoothing);
			-moz-osx-font-smoothing: var(--global-moz-font-smoothing);
		}
	}
`
