import styled, { css } from 'styled-components';
import { media } from './media';

export const CellBase = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  line-height: normal;
  ${({ theme, head }) => theme[head ? 'headCells' : 'cells'].style};
  ${props => props.noPadding && 'padding: 0'};
`;

// Flex calculations
export const Cell = styled(CellBase)`
  flex-grow: ${props => (props.column.grow === 0 || props.column.button ? 0 : props.column.grow || 1)};
  flex-shrink: 0;
  flex-basis: 0;
  max-width: ${props => props.column.maxWidth || '100%'};
  min-width: ${props => (props.column.minWidth || '100px')};
  ${props => props.column.width && css`
    min-width: ${props.column.width};
    max-width: ${props.column.width};
  `};
  ${props => props.column.right && 'justify-content: flex-end'};
  ${props => (props.column.center || props.column.button) && 'justify-content: center'};
  ${props => (props.column.compact || props.column.button) && 'padding: 0'};

  /* handle hiding cells */
  ${props => props.column.hide && props.column.hide === 'sm' && media.sm`
    display: none;
  `};
  ${props => props.column.hide && props.column.hide === 'md' && media.md`
    display: none;
  `};
  ${props => props.column.hide && props.column.hide === 'lg' && media.lg`
    display: none;
  `};
  ${props => props.column.hide && Number.isInteger(props.column.hide) && media.custom(props.column.hide)`
    display: none;
  `};
`;
