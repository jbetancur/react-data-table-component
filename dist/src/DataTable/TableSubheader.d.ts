import * as React from 'react';
declare type AlignItems = 'center' | 'left' | 'right';
declare type SubheaderProps = {
    align?: AlignItems;
    wrapContent?: boolean;
    children?: React.ReactNode;
};
declare const Subheader: ({ align, wrapContent, ...rest }: SubheaderProps) => JSX.Element;
export default Subheader;
