import styled, { css } from 'styled-components';

const lastCellPaddingWhenButton = css`
  &:not(:last-child) {
    padding-right: calc(${props => props.theme.cells.cellPadding} / 2);
  }
`;

const lastCellPadding = css`
  &:last-child {
    padding-right: calc(${props => props.theme.cells.cellPadding} / 2);
  }
`;

export const CellBase = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  line-height: normal;
  padding-left: calc(${props => props.theme.cells.cellPadding} / 6);
  padding-right: calc(${props => props.theme.cells.cellPadding} / 6);
  padding-top: calc(${props => props.theme.cells.cellPadding} / 12);
  padding-bottom: calc(${props => props.theme.cells.cellPadding} / 12);
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
  ${props => props.column.compact && `padding: calc(${props.theme.cells.cellPadding} / 12)`};
  ${props => !props.internalCell && css`
    &:first-child {
      padding-left: calc(${props.theme.cells.cellPadding} / 2);
    }
  `};

  /* calculate left/right edge paddings */
  ${props => (props.column.button ? lastCellPaddingWhenButton : lastCellPadding)};
`;
