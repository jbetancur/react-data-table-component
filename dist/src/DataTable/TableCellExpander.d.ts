/// <reference types="react" />
import { ExpandableIcon } from './types';
type CellExpanderProps<T> = {
    disabled: boolean;
    expanded: boolean;
    expandableIcon: ExpandableIcon;
    id: string | number;
    row: T;
    onToggled: (row: T) => void;
};
declare function CellExpander<T>({ row, expanded, expandableIcon, id, onToggled, disabled, }: CellExpanderProps<T>): JSX.Element;
export default CellExpander;
