import styled from 'styled-components';

const TableHeadRow = styled.div`
  display: flex;
  align-items: stretch;
  min-height: ${props => (props.dense ? props.theme.header.denseHeight : props.theme.header.height)};
  width: 100%;
`;

export default TableHeadRow;
