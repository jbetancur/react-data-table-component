import styled, { withTheme } from 'styled-components';

const TableHead = styled.thead`
  text-align: left;
  background-color: ${props => props.theme.header.backgroundColor};
`;

export default withTheme(TableHead);
