import styled, { css } from 'styled-components';

const fixedCSS = css`
	position: sticky;
	position: -webkit-sticky; /* Safari */
	top: 0;
	z-index: 1;
`;

const Head = styled.div<{
	$fixedHeader?: boolean;
}>`
	display: flex;
	width: 100%;
	${({ $fixedHeader }) => $fixedHeader && fixedCSS};
	${({ theme }) => theme.head.style};
`;

export default Head;
