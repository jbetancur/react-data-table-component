import * as React from 'react';
import './DataTable.css';
import DropDownIcon from '../icons/Dropdown';

type SelectProps = {
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	defaultValue: string | number;
	children: React.ReactNode;
} & React.AriaAttributes;

export default function Select({ defaultValue, onChange, ...rest }: SelectProps): JSX.Element {
	return (
		<div className="rdt_selectWrapper">
			<select className="rdt_selectControl" onChange={onChange} defaultValue={defaultValue} {...rest} />
			<DropDownIcon />
		</div>
	);
}
