import styled, { css } from 'styled-components';

/* Hack when using layovers/menus that get clipped by overflow-x
  when a table is responsive due to overflow-xy scroll spec stupidity.
  Note: The parent element height must be set to 100%!
  https://www.brunildo.org/test/Overflowxy2.html
*/

const ResponsiveWrapper = styled.div<{
	responsive: boolean;
	overflowYOffset: string;
	overflowY: boolean;
}>`
	position: relative;
	width: 100%;
	border-radius: inherit;
	${({ responsive }) =>
		responsive &&
		css`
			overflow-x: auto;

			// prevents vertical scrolling in firefox
			overflow-y: hidden;
			min-height: 0;
		`};
	${({ overflowY, overflowYOffset, responsive }) =>
		overflowY &&
		responsive &&
		overflowYOffset &&
		css`
			padding-bottom: ${overflowYOffset};
			margin-bottom: -${overflowYOffset};
		`};
`;

export default ResponsiveWrapper;
