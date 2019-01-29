import styled from 'styled-components';

const TableFooter = styled.nav`
  display: flex;
  flex: 1 1 auto;
  justify-content: flex-end;
  align-items: center;
  min-height: 56px;
  padding-right: 8px;
  padding-left: 8px;
  width: 100%;
  border-top: 1px solid ${props => props.theme.rows.borderColor};
`;
export default TableFooter;
