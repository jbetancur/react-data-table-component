import * as React from 'react';
interface CheckboxProps {
    name: string;
    component?: any;
    componentOptions?: {
        [key: string]: unknown;
    };
    indeterminate?: boolean;
    checked?: boolean;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent) => void;
}
declare function Checkbox({ name, component, componentOptions, indeterminate, checked, disabled, onClick, }: CheckboxProps): JSX.Element;
declare const _default: React.MemoExoticComponent<typeof Checkbox>;
export default _default;
