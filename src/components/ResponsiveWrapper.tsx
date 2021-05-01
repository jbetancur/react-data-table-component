import styled, { css } from 'styled-components';

const ResponsiveWrapper = styled.div<{
	responsive: boolean;
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
`;

export default ResponsiveWrapper;
