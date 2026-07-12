import * as React from 'react';
import '../DataTable.css';
import { CellBase } from './Cell';
import Checkbox from './Checkbox';
import { useHeadContext } from '../context/HeadContext';

function ColumnCheckbox<T>(): JSX.Element | null {
	const { selectAll, cellNavigation, activeCell } = useHeadContext<T>();
	// Rendered only when selection is on (DataTableHead gates on the slice).
	if (!selectAll) return null;

	const { allSelected, selectedRows, visibleRows, disabled: rowDisabled, keyField, mergeSelections } = selectAll;

	const indeterminate = selectedRows.length > 0 && !allSelected;
	const rows = rowDisabled ? visibleRows.filter((row: T) => !rowDisabled(row)) : visibleRows;
	const isDisabled = rows.length === 0;
	const rowCount = Math.min(visibleRows.length, rows.length);

	const handleSelectAll = () => {
		selectAll.onSelectAllRows({
			type: 'SELECT_ALL_ROWS',
			rows,
			rowCount,
			mergeSelections,
			keyField,
		});
	};

	const navActive = cellNavigation && activeCell?.row === -1 && activeCell?.col === 0;

	return (
		<CellBase
			className={['rdt_TableCol', 'rdt_columnCheckbox'].join(' ')}
			role="columnheader"
			$headCell
			$noPadding
			tabIndex={cellNavigation ? -1 : undefined}
			data-nav-row={cellNavigation ? -1 : undefined}
			data-nav-col={cellNavigation ? 0 : undefined}
			data-nav-widget={cellNavigation ? 'true' : undefined}
		>
			<Checkbox
				name="Select all rows"
				component={selectAll.component}
				componentOptions={selectAll.componentProps}
				onClick={handleSelectAll}
				checked={allSelected}
				indeterminate={indeterminate}
				disabled={isDisabled}
				tabIndex={cellNavigation ? (navActive ? 0 : -1) : undefined}
			/>
		</CellBase>
	);
}

export default ColumnCheckbox;
