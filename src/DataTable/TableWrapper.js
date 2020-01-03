import styled from 'styled-components';

const TableWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  ${props => props.theme.tableWrapper.style};
`;

export default TableWrapper;
