import styled, { css } from 'styled-components';

const disabledCSS = css`
	pointer-events: none;
`;

const TableHeadRow = styled.div<{
	dense?: boolean;
	disabled?: boolean;
}>`
	display: flex;
	align-items: stretch;
	width: 100%;
	${({ theme }) => theme.headRow.style};
	${({ dense, theme }) => dense && theme.headRow.denseStyle};
	${({ disabled }) => disabled && disabledCSS};
`;

export default TableHeadRow;
