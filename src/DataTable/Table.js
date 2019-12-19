import styled, { css } from 'styled-components';

const disabled = css`
  pointer-events: none;
  opacity: 0.4;
`;

const TableStyle = styled.div`
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: 100%;
  ${props => props.disabled && disabled};
  ${props => props.theme.table.style};
`;

export default TableStyle;
