import { mergeDeep } from './util';
import { TableStyles } from './types';

/**
 * Merges user-supplied customStyles with an empty base.
 * All visual defaults live in DataTable.css via CSS custom properties.
 */
export const createStyles = (customStyles: TableStyles = {}): TableStyles => mergeDeep({}, customStyles);
