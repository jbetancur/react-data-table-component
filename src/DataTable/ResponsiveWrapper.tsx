import styled, { css } from 'styled-components';

/* Hack when using layovers/menus that get clipped by overflow-x
  when a table is responsive due to overflow-xy scroll spec stupidity.
  Note: The parent element height must be set to 100%!
  https://www.brunildo.org/test/Overflowxy2.html
*/

const ResponsiveWrapper = styled.div<{
	$responsive: boolean;
	$fixedHeader?: boolean;
	$fixedHeaderScrollHeight?: string;
}>`
	position: relative;
	width: 100%;
	border-radius: inherit;
	${({ $responsive, $fixedHeader }) =>
		$responsive &&
		css`
			overflow-x: auto;

			// hidden prevents vertical scrolling in firefox when fixedHeader is disabled
			overflow-y: ${$fixedHeader ? 'auto' : 'hidden'};
			min-height: 0;
		`};

	${({ $fixedHeader = false, $fixedHeaderScrollHeight = '100vh' }) =>
		$fixedHeader &&
		css`
			max-height: ${$fixedHeaderScrollHeight};
			-webkit-overflow-scrolling: touch;
		`};

	${({ theme }) => theme.responsiveWrapper.style};
`;

export default ResponsiveWrapper;
