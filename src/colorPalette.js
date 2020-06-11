import { css } from 'linaria'

export const lightTheme = css`
	-webkit-font-smoothing: auto;
	-moz-osx-font-smoothing: auto;
`

export const darkTheme = css`
	${'' /* 
      When using light text on dark background, text appears thicker.
      Setting font smoothing fixes this.
      Setting it globally allows us to change it when light mode is on */}
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
`
