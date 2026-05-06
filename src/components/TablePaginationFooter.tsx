import * as React from 'react';
import { PaginationComponent, PaginationOptions } from '../types';
import { Direction } from '../constants';

interface TablePaginationFooterProps {
	Pagination: PaginationComponent;
	onChangePage: (page: number) => void;
	onChangeRowsPerPage: (newRowsPerPage: number) => void;
	rowCount: number;
	currentPage: number;
	rowsPerPage: number;
	direction: Direction;
	paginationRowsPerPageOptions: number[];
	paginationIconLastPage?: React.ReactNode;
	paginationIconFirstPage?: React.ReactNode;
	paginationIconNext?: React.ReactNode;
	paginationIconPrevious?: React.ReactNode;
	paginationComponentOptions: PaginationOptions;
}

function TablePaginationFooter({
	Pagination,
	onChangePage,
	onChangeRowsPerPage,
	rowCount,
	currentPage,
	rowsPerPage,
	direction,
	paginationRowsPerPageOptions,
	paginationIconLastPage,
	paginationIconFirstPage,
	paginationIconNext,
	paginationIconPrevious,
	paginationComponentOptions,
}: TablePaginationFooterProps): JSX.Element {
	return (
		<div>
			<Pagination
				onChangePage={onChangePage}
				onChangeRowsPerPage={onChangeRowsPerPage}
				rowCount={rowCount}
				currentPage={currentPage}
				rowsPerPage={rowsPerPage}
				direction={direction}
				paginationRowsPerPageOptions={paginationRowsPerPageOptions}
				paginationIconLastPage={paginationIconLastPage}
				paginationIconFirstPage={paginationIconFirstPage}
				paginationIconNext={paginationIconNext}
				paginationIconPrevious={paginationIconPrevious}
				paginationComponentOptions={paginationComponentOptions}
			/>
		</div>
	);
}

export default React.memo(TablePaginationFooter);
