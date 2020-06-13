import { css } from 'linaria'

export const lightTheme = css`
	-webkit-font-smoothing: auto;
	-moz-osx-font-smoothing: auto;

	--boxShadow-elevation-0: 0 0 0 1px rgba(16, 22, 26, 0.15), 0 0 0 rgba(16, 22, 26, 0),
		0 0 0 rgba(16, 22, 26, 0);

	--boxShadow-elevation-1: 0 0 0 1px rgba(16, 22, 26, 0.1), 0 0 0 rgba(16, 22, 26, 0),
		0 1px 1px rgba(16, 22, 26, 0.2);

	--boxShadow-elevation-2: 0 0 0 1px rgba(16, 22, 26, 0.1), 0 1px 1px rgba(16, 22, 26, 0.2),
		0 2px 6px rgba(16, 22, 26, 0.2);

	--boxShadow-elevation-3: 0 0 0 1px rgba(16, 22, 26, 0.1), 0 2px 4px rgba(16, 22, 26, 0.2),
		0 8px 24px rgba(16, 22, 26, 0.2);

	--boxShadow-elevation-4: 0 0 0 1px rgba(16, 22, 26, 0.1), 0 4px 8px rgba(16, 22, 26, 0.2),
		0 18px 46px 6px rgba(16, 22, 26, 0.2);
`

export const darkTheme = css`
	${'' /* 
      When using light text on dark background, text appears thicker.
      Setting font smoothing fixes this.
      Setting it globally allows us to change it when light mode is on */}
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;

	--boxShadow-elevation-0: 0 0 0 1px rgba(16, 22, 26, 0.4), 0 0 0 rgba(16, 22, 26, 0),
		0 0 0 rgba(16, 22, 26, 0);

	--boxShadow-elevation-1: 0 0 0 1px rgba(16, 22, 26, 0.2), 0 0 0 rgba(16, 22, 26, 0),
		0 1px 1px rgba(16, 22, 26, 0.4);

	--boxShadow-elevation-2: 0 0 0 1px rgba(16, 22, 26, 0.2), 0 1px 1px rgba(16, 22, 26, 0.4),
		0 2px 6px rgba(16, 22, 26, 0.4);

	--boxShadow-elevation-3: 0 0 0 1px rgba(16, 22, 26, 0.2), 0 2px 4px rgba(16, 22, 26, 0.4),
		0 8px 24px rgba(16, 22, 26, 0.4);

	--boxShadow-elevation-4: 0 0 0 1px rgba(16, 22, 26, 0.2), 0 4px 8px rgba(16, 22, 26, 0.4),
		0 18px 46px 6px rgba(16, 22, 26, 0.4);
`
