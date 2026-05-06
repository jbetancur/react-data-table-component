import * as React from 'react';
import Body from './TableBody';
import Row from './TableRow';
import NoData from './NoDataWrapper';
import ProgressWrapper from './ProgressWrapper';
import { prop, isEmpty, isRowSelected } from '../util';
import { TableRow, RowState } from '../types';
import { useRowContext } from '../context/RowContext';

interface DataTableBodyProps<T> {
	tableRows: T[];
	sortedData: T[];
	selectedRows: T[];
	keyField: string;
	isBusy: boolean;
	noDataComponent: React.ReactNode;
	progressComponent: React.ReactNode;
	persistTableHead: boolean;
	expandableRowExpanded?: RowState<T>;
	expandableRowDisabled?: RowState<T>;
}

function DataTableBody<T>({
	tableRows,
	sortedData,
	selectedRows,
	keyField,
	isBusy,
	noDataComponent,
	progressComponent,
	persistTableHead,
	expandableRowExpanded,
	expandableRowDisabled,
}: DataTableBodyProps<T>): JSX.Element {
	const { expandableRows } = useRowContext<T>();

	return (
		<>
			{!sortedData.length && !isBusy && <NoData>{noDataComponent}</NoData>}

			{isBusy && persistTableHead && <ProgressWrapper>{progressComponent}</ProgressWrapper>}

			{!isBusy && sortedData.length > 0 && (
				<Body className="rdt_TableBody" role="rowgroup">
					{tableRows.map((row, i) => {
						const key = prop(row as TableRow, keyField) as string | number;
						const id = isEmpty(key) ? i : key;
						const selected = isRowSelected(row, selectedRows, keyField);
						const defaultExpanded = !!(expandableRows && expandableRowExpanded && expandableRowExpanded(row));
						const defaultExpanderDisabled = !!(expandableRows && expandableRowDisabled && expandableRowDisabled(row));

						return (
							<Row
								id={id}
								key={id}
								data-row-id={id}
								row={row}
								rowCount={sortedData.length}
								rowIndex={i}
								selected={selected}
								defaultExpanded={defaultExpanded}
								defaultExpanderDisabled={defaultExpanderDisabled}
							/>
						);
					})}
				</Body>
			)}
		</>
	);
}

export default DataTableBody;
