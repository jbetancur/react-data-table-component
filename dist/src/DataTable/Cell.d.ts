import { HTMLAttributes } from 'react';
import { TableColumnBase } from './types';
interface CellBaseType extends HTMLAttributes<HTMLDivElement> {
    headCell?: boolean;
    noPadding?: boolean;
}
export declare const CellBase: import("styled-components").StyledComponent<"div", any, CellBaseType, never>;
export type CellProps = Pick<TableColumnBase, 'button' | 'grow' | 'maxWidth' | 'minWidth' | 'width' | 'right' | 'center' | 'compact' | 'hide' | 'allowOverflow'>;
export declare const CellExtended: import("styled-components").StyledComponent<"div", any, CellBaseType & CellProps, never>;
export {};
