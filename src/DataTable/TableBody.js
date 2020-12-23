import styled, { css } from 'styled-components';

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
`;

TableBody.defaultProps = {
  fixedHeaderScrollHeight: '100vh',
  offset: 0,
};

export default TableBody;
