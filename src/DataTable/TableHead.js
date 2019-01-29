import styled from 'styled-components';

const TableHead = styled.div`
  display: flex;
  text-align: left;
  background-color: ${props => props.theme.header.backgroundColor};
`;

export default TableHead;
