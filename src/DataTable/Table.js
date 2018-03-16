import styled from 'styled-components';

const TableStyle = styled.table`
  height: 100px;
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
  ${props => props.disabled && 'pointer-events: none'};
  ${props => props.disabled && 'opacity: 0.4'};
`;

export default TableStyle;
