import * as React from 'react';
type AlignItems = 'center' | 'left' | 'right';
type SubheaderProps = {
    align?: AlignItems;
    wrapContent?: boolean;
    children?: React.ReactNode;
};
declare const Subheader: ({ align, wrapContent, ...rest }: SubheaderProps) => JSX.Element;
export default Subheader;
