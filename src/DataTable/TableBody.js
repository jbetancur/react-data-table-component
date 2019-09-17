import styled, { css } from 'styled-components';

const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  ${({ fixedHeader, hasOffset, offset, fixedHeaderScrollHeight }) => fixedHeader && css`
    max-height: ${hasOffset ? `calc(${fixedHeaderScrollHeight} - ${offset})` : fixedHeaderScrollHeight};
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  `};
`;

TableBody.defaultProps = {
  fixedHeaderScrollHeight: '100vh',
  offset: 0,
};

export default TableBody;
