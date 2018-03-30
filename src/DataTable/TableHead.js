import styled, { withTheme } from 'styled-components';

const TableHead = styled.div`
  display: flex;
  text-align: left;
  background-color: ${props => props.theme.header.backgroundColor};
`;

export default withTheme(TableHead);
