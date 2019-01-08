import styled, { withTheme } from 'styled-components';

const TableFooter = styled.nav`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 56px;
  min-height: 56px;
  padding-right: 8px;
  width: 100%;
  border-top: 1px solid ${props => props.theme.rows.borderColor};
`;
export default withTheme(TableFooter);
