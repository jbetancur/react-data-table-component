import styled, { css } from 'styled-components';

const TableBody = styled.div<{
	fixedHeader?: boolean;
	fixedHeaderScrollHeight?: string;
}>`
	display: flex;
	flex-direction: column;
	${({ fixedHeader = false, fixedHeaderScrollHeight = '100vh' }) =>
		fixedHeader &&
		css`
			max-height: ${fixedHeaderScrollHeight};
			overflow-y: auto;
			-webkit-overflow-scrolling: touch;
		`};
`;

export default TableBody;
