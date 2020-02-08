import styled from 'styled-components';
import { CellBase } from './Cell';

const TableColExpander = styled(CellBase)`
  white-space: nowrap;
  ${props => props.theme.expanderCell.style};
`;

export default TableColExpander;
