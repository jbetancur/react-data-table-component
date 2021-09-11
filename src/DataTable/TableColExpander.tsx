import styled from 'styled-components';
import { CellBase } from './Cell';

const ColumnExpander = styled(CellBase)`
	white-space: nowrap;
	${({ theme }) => theme.expanderCell.style};
`;

export default ColumnExpander;
