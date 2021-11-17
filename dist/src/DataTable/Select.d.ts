import * as React from 'react';
declare type SelectProps = {
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    defaultValue: string | number;
    children: React.ReactNode;
};
declare const Select: ({ defaultValue, onChange, ...rest }: SelectProps) => JSX.Element;
export default Select;
