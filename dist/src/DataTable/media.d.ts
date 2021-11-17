import { CSSObject, FlattenSimpleInterpolation } from 'styled-components';
export declare const SMALL = 599;
export declare const MEDIUM = 959;
export declare const LARGE = 1280;
export declare const media: {
    sm: (literals: TemplateStringsArray, ...args: CSSObject[]) => FlattenSimpleInterpolation;
    md: (literals: TemplateStringsArray, ...args: CSSObject[]) => FlattenSimpleInterpolation;
    lg: (literals: TemplateStringsArray, ...args: CSSObject[]) => FlattenSimpleInterpolation;
    custom: (value: number) => (literals: TemplateStringsArray, ...args: CSSObject[]) => FlattenSimpleInterpolation;
};
