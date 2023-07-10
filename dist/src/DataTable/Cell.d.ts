import { TableColumnBase } from './types';
export declare const CellBase: import("styled-components").StyledComponent<"div", any, {
    headCell?: boolean;
    noPadding?: boolean;
}, never>;
export type CellProps = Pick<TableColumnBase, 'button' | 'grow' | 'maxWidth' | 'minWidth' | 'width' | 'right' | 'center' | 'compact' | 'hide' | 'allowOverflow'>;
export declare const CellExtended: import("styled-components").StyledComponent<"div", any, {
    headCell?: boolean;
    noPadding?: boolean;
} & CellProps, never>;
