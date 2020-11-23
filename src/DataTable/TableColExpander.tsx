import styled from 'styled-components';
import { CellBase } from './Cell';

const TableColExpander = styled(CellBase)`
	white-space: nowrap;
	${({ theme }) => theme.expanderCell.style};
`;

export default TableColExpander;
