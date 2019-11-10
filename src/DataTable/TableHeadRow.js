import styled from 'styled-components';

const TableHeadRow = styled.div`
  display: flex;
  align-items: stretch;
  min-height: ${props => (props.dense ? props.theme.header.denseHeight : props.theme.header.height)};
  width: 100%;
  border-bottom-style: ${props => props.theme.header.borderStyle};
  border-bottom-width: ${props => props.theme.header.borderWidth};
  border-bottom-color: ${props => props.theme.header.borderColor};
`;

export default TableHeadRow;
