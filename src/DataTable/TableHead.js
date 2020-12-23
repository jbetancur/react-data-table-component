import styled from 'styled-components';

const TableHead = styled.div`
  display: flex;
  text-align: left;
  position: sticky;
  top: 0;
  background-color: rgb(255, 255, 255);
  z-index: 2;
  ${props => props.theme.head.style};
`;

export default TableHead;
