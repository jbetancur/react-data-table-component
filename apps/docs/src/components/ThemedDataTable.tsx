import * as React from 'react';
import DataTable, { type TableProps, type DataTableHandle } from 'react-data-table-component';

function ThemedDataTableInner<T>(
	{ theme, colorMode, ...rest }: TableProps<T>,
	ref: React.ForwardedRef<DataTableHandle>,
) {
	return <DataTable ref={ref} theme={theme} colorMode={colorMode} {...rest} />;
}

const ThemedDataTable = React.forwardRef(ThemedDataTableInner) as <T>(
	props: TableProps<T> & { ref?: React.Ref<DataTableHandle> },
) => JSX.Element;

export default ThemedDataTable;
