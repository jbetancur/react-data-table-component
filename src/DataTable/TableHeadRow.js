import styled from 'styled-components';

const TableHeadRow = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  ${props => props.theme.headRow.style};
  ${props => (props.dense && props.theme.headRow.denseStyle)};
`;

export default TableHeadRow;
