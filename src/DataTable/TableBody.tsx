import styled, { css } from 'styled-components';

const TableBody = styled.div<{
	fixedHeader?: boolean;
	fixedHeaderScrollHeight?: string;
	hasOffset?: boolean;
	offset?: string;
}>`
	display: flex;
	flex-direction: column;
	${({ fixedHeader = false, hasOffset = false, offset = 0, fixedHeaderScrollHeight = '100vh' }) =>
		fixedHeader &&
		css`
			max-height: ${hasOffset ? `calc(${fixedHeaderScrollHeight} - ${offset})` : fixedHeaderScrollHeight};
			overflow-y: scroll;
			-webkit-overflow-scrolling: touch;
		`};
`;

export default TableBody;
