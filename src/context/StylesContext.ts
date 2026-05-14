import * as React from 'react';
import type { TableStyles } from '../types';

export const StylesContext = React.createContext<TableStyles>({});

export function useStyles(): TableStyles {
	return React.useContext(StylesContext);
}
