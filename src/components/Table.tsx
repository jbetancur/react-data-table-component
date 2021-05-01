import styled, { css } from 'styled-components';

const disabledCSS = css`
	pointer-events: none;
	opacity: 0.4;
`;

const TableStyle = styled.div<{
	disabled?: boolean;
}>`
	position: relative;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	max-width: 100%;
	${({ disabled }) => disabled && disabledCSS};
	${({ theme }) => theme.table.style};
`;

export default TableStyle;
