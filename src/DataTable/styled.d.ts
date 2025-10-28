import 'styled-components';
import { TableStyles } from './types';

// Augment styled-components DefaultTheme with our custom theme structure
declare module 'styled-components' {
	export interface DefaultTheme extends TableStyles {}
}
