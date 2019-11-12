import styled from 'styled-components';

const TableFooter = styled.footer`
  display: flex;
  flex: 1 1 auto;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
  min-height: 56px;
  padding-right: 8px;
  padding-left: 8px;
  width: 100%;
  background-color: ${props => props.theme.pagination.backgroundColor};
  border-top-style: ${props => props.theme.footer.seperatorStyle};
  border-top-width: ${props => props.theme.footer.seperatorWidth};
  border-top-color: ${props => props.theme.footer.seperatorColor};
`;

export default TableFooter;
