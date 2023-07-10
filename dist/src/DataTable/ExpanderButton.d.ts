import { ExpandableIcon } from './types';
type ExpanderButtonProps<T> = {
    disabled?: boolean;
    expanded?: boolean;
    expandableIcon: ExpandableIcon;
    id: string | number;
    row: T;
    onToggled?: (row: T) => void;
};
declare function ExpanderButton<T>({ disabled, expanded, expandableIcon, id, row, onToggled, }: ExpanderButtonProps<T>): JSX.Element;
export default ExpanderButton;
