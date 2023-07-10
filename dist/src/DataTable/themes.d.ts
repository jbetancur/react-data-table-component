import { Theme, Themes } from './types';
type ThemeMapping = {
    [propertyName: string]: Theme;
};
export declare const defaultThemes: ThemeMapping;
export declare function createTheme<T>(name?: string, customTheme?: T, inherit?: Themes): Theme;
export {};
