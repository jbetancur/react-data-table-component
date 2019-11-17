import styled, { css } from 'styled-components';

const disabled = css`
  pointer-events: none;
`;

const TableHeadRow = styled.div`
  display: flex;
  align-items: stretch;
  min-height: ${props => (props.dense ? props.theme.header.denseHeight : props.theme.header.height)};
  width: 100%;
  border-bottom-style: ${props => props.theme.header.borderStyle};
  border-bottom-width: ${props => props.theme.header.borderWidth};
  border-bottom-color: ${props => props.theme.header.borderColor};
  ${props => props.disabled && disabled};
`;

export default TableHeadRow;
