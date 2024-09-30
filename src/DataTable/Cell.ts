import styled, { css } from 'styled-components';
import { media } from './media';
import { TableColumnBase } from './types';

export const CellBase = styled.div<{
	$headCell?: boolean;
	$noPadding?: boolean;
}>`
	position: relative;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	line-height: normal;
	${({ theme, $headCell }) => theme[$headCell ? 'headCells' : 'cells'].style};
	${({ $noPadding }) => $noPadding && 'padding: 0'};
`;

export type CellProps = Pick<
	TableColumnBase,
	'button' | 'grow' | 'maxWidth' | 'minWidth' | 'width' | 'right' | 'center' | 'compact' | 'hide' | 'allowOverflow'
>;

// Flex calculations
export const CellExtended = styled(CellBase)<CellProps>`
	flex-grow: ${({ button, grow }) => (grow === 0 || button ? 0 : grow || 1)};
	flex-shrink: 0;
	flex-basis: 0;
	max-width: ${({ maxWidth }) => maxWidth || '100%'};
	min-width: ${({ minWidth }) => minWidth || '100px'};
	${({ width }) =>
		width &&
		css`
			min-width: ${width};
			max-width: ${width};
		`};
	${({ right }) => right && 'justify-content: flex-end'};
	${({ button, center }) => (center || button) && 'justify-content: center'};
	${({ compact, button }) => (compact || button) && 'padding: 0'};

	/* handle hiding cells */
	${({ hide }) =>
		hide &&
		hide === 'sm' &&
		media.sm`
    display: none;
  `};
	${({ hide }) =>
		hide &&
		hide === 'md' &&
		media.md`
    display: none;
  `};
	${({ hide }) =>
		hide &&
		hide === 'lg' &&
		media.lg`
    display: none;
  `};
	${({ hide }) =>
		hide &&
		Number.isInteger(hide) &&
		media.custom(hide as number)`
    display: none;
  `};
`;
