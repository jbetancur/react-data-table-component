import styled, { css } from 'styled-components';

const disabled = css`
  pointer-events: none;
`;

const TableHeadRow = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  ${props => props.theme.headRow.style};
  ${props => (props.dense && props.theme.headRow.denseStyle)};
  ${props => props.disabled && disabled};
`;

export default TableHeadRow;
