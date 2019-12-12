import styled from 'styled-components';

const TableHead = styled.div`
  display: flex;
  text-align: left;
  ${props => props.theme.head.style};
`;

export default TableHead;
