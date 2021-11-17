import { TableColumnBase } from './types';
export declare const CellBase: import("styled-components").StyledComponent<"div", any, {
    headCell?: boolean | undefined;
    noPadding?: boolean | undefined;
}, never>;
export declare type CellProps = Pick<TableColumnBase, 'button' | 'grow' | 'maxWidth' | 'minWidth' | 'width' | 'right' | 'center' | 'compact' | 'hide' | 'allowOverflow'>;
export declare const CellExtended: import("styled-components").StyledComponent<"div", any, {
    headCell?: boolean | undefined;
    noPadding?: boolean | undefined;
} & CellProps, never>;
