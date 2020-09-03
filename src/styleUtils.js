import { keyframes } from '@emotion/core'

const skeletonKeyframes = keyframes`
 from {
    fill: var(--grey1);
  }

  to {
    fill: var(--grey2);
  }
`

// use to set pie and bar chart loading glowing effect
export const blinkingSkeletonAnimation = {
	'&& g path': {
		animation: `${skeletonKeyframes} 1.5s infinite`,
	},
}
