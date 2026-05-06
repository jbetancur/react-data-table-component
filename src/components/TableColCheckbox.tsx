import * as React from 'react';
import '../DataTable.css';
import { CellBase } from './Cell';
import Checkbox from './Checkbox';
import { useHeadContext } from '../context/HeadContext';

function ColumnCheckbox<T>(): JSX.Element {
	const {
		allSelected,
		selectedRows,
		visibleRows,
		selectableRowsComponent,
		selectableRowsComponentProps,
		selectableRowDisabled,
		keyField,
		mergeSelections,
		onSelectAllRows,
	} = useHeadContext<T>();

	const indeterminate = selectedRows.length > 0 && !allSelected;
	const rows = selectableRowDisabled ? visibleRows.filter((row: T) => !selectableRowDisabled(row)) : visibleRows;
	const isDisabled = rows.length === 0;
	const rowCount = Math.min(visibleRows.length, rows.length);

	const handleSelectAll = () => {
		onSelectAllRows({
			type: 'SELECT_ALL_ROWS',
			rows,
			rowCount,
			mergeSelections,
			keyField,
		});
	};

	return (
		<CellBase className={['rdt_TableCol', 'rdt_columnCheckbox'].join(' ')} $headCell $noPadding>
			<Checkbox
				name="select-all-rows"
				component={selectableRowsComponent}
				componentOptions={selectableRowsComponentProps}
				onClick={handleSelectAll}
				checked={allSelected}
				indeterminate={indeterminate}
				disabled={isDisabled}
			/>
		</CellBase>
	);
}

export default ColumnCheckbox;
