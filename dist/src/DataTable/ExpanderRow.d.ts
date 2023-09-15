/// <reference types="react" />
import { CSSObject } from 'styled-components';
import { ComponentProps, ExpandableRowsComponent } from './types';
type ExpanderRowProps<T> = {
    data: T;
    ExpanderComponent: ExpandableRowsComponent<T>;
    extendedRowStyle: CSSObject;
    extendedClassNames: string;
    expanderComponentProps: ComponentProps;
};
declare function ExpanderRow<T>({ data, ExpanderComponent, expanderComponentProps, extendedRowStyle, extendedClassNames, }: ExpanderRowProps<T>): JSX.Element;
declare const _default: typeof ExpanderRow;
export default _default;
