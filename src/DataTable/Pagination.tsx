import * as React from 'react';
import styled from 'styled-components';
import Select from './Select';
import { getNumberOfPages } from './util';
import useWindowSize from '../hooks/useWindowSize';
import useRTL from '../hooks/useRTL';
import { media, SMALL } from './media';
import { Direction } from './constants';
import { PaginationOptions } from './types';
import { defaultProps } from './defaultProps';

const defaultComponentOptions = {
	rowsPerPageText: 'Rows per page:',
	rangeSeparatorText: 'of',
	noRowsPerPage: false,
	selectAllRowsItem: false,
	selectAllRowsItemText: 'All',
};

const PaginationWrapper = styled.nav`
	display: flex;
	flex: 1 1 auto;
	justify-content: flex-end;
	align-items: center;
	box-sizing: border-box;
	padding-right: 8px;
	padding-left: 8px;
	width: 100%;
	${({ theme }) => theme.pagination.style};
`;

const Button = styled.button<{
	$isRTL: boolean;
}>`
	position: relative;
	display: block;
	user-select: none;
	border: none;
	${({ theme }) => theme.pagination.pageButtonsStyle};
	${({ $isRTL }) => $isRTL && 'transform: scale(-1, -1)'};
`;

const PageList = styled.div`
	display: flex;
	align-items: center;
	border-radius: 4px;
	white-space: nowrap;
	${media.sm`
    width: 100%;
    justify-content: space-around;
  `};
`;

const Span = styled.span`
	flex-shrink: 1;
	user-select: none;
`;

const Range = styled(Span)`
	margin: 0 24px;
`;

const RowLabel = styled(Span)`
	margin: 0 4px;
`;

interface PaginationProps {
	rowsPerPage: number;
	rowCount: number;
	currentPage: number;
	direction?: Direction;
	paginationRowsPerPageOptions?: number[];
	paginationIconLastPage?: React.ReactNode;
	paginationIconFirstPage?: React.ReactNode;
	paginationIconNext?: React.ReactNode;
	paginationIconPrevious?: React.ReactNode;
	paginationComponentOptions?: PaginationOptions;
	onChangePage: (page: number) => void;
	onChangeRowsPerPage: (numRows: number, currentPage: number) => void;
}

function Pagination({
	rowsPerPage,
	rowCount,
	currentPage,
	direction = defaultProps.direction,
	paginationRowsPerPageOptions = defaultProps.paginationRowsPerPageOptions,
	paginationIconLastPage = defaultProps.paginationIconLastPage,
	paginationIconFirstPage = defaultProps.paginationIconFirstPage,
	paginationIconNext = defaultProps.paginationIconNext,
	paginationIconPrevious = defaultProps.paginationIconPrevious,
	paginationComponentOptions = defaultProps.paginationComponentOptions,
	onChangeRowsPerPage = defaultProps.onChangeRowsPerPage,
	onChangePage = defaultProps.onChangePage,
}: PaginationProps): JSX.Element {
	const windowSize = useWindowSize();
	const isRTL = useRTL(direction);
	const shouldShow = windowSize.width && windowSize.width > SMALL;
	// const isRTL = detectRTL(direction);
	const numPages = getNumberOfPages(rowCount, rowsPerPage);
	const lastIndex = currentPage * rowsPerPage;
	const firstIndex = lastIndex - rowsPerPage + 1;
	const disabledLesser = currentPage === 1;
	const disabledGreater = currentPage === numPages;
	const options = { ...defaultComponentOptions, ...paginationComponentOptions };
	const range =
		currentPage === numPages
			? `${firstIndex}-${rowCount} ${options.rangeSeparatorText} ${rowCount}`
			: `${firstIndex}-${lastIndex} ${options.rangeSeparatorText} ${rowCount}`;

	const handlePrevious = React.useCallback(() => onChangePage(currentPage - 1), [currentPage, onChangePage]);
	const handleNext = React.useCallback(() => onChangePage(currentPage + 1), [currentPage, onChangePage]);
	const handleFirst = React.useCallback(() => onChangePage(1), [onChangePage]);
	const handleLast = React.useCallback(
		() => onChangePage(getNumberOfPages(rowCount, rowsPerPage)),
		[onChangePage, rowCount, rowsPerPage],
	);
	const handleRowsPerPage = React.useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => onChangeRowsPerPage(Number(e.target.value), currentPage),
		[currentPage, onChangeRowsPerPage],
	);

	const selectOptions = paginationRowsPerPageOptions.map((num: number) => (
		<option key={num} value={num}>
			{num}
		</option>
	));

	if (options.selectAllRowsItem) {
		selectOptions.push(
			<option key={-1} value={rowCount}>
				{options.selectAllRowsItemText}
			</option>,
		);
	}

	const select = (
		<Select onChange={handleRowsPerPage} defaultValue={rowsPerPage} aria-label={options.rowsPerPageText}>
			{selectOptions}
		</Select>
	);

	return (
		<PaginationWrapper className="rdt_Pagination">
			{!options.noRowsPerPage && shouldShow && (
				<>
					<RowLabel>{options.rowsPerPageText}</RowLabel>
					{select}
				</>
			)}
			{shouldShow && <Range>{range}</Range>}
			<PageList>
				<Button
					id="pagination-first-page"
					type="button"
					aria-label="First Page"
					aria-disabled={disabledLesser}
					onClick={handleFirst}
					disabled={disabledLesser}
					$isRTL={isRTL}
				>
					{paginationIconFirstPage}
				</Button>

				<Button
					id="pagination-previous-page"
					type="button"
					aria-label="Previous Page"
					aria-disabled={disabledLesser}
					onClick={handlePrevious}
					disabled={disabledLesser}
					$isRTL={isRTL}
				>
					{paginationIconPrevious}
				</Button>

				{!options.noRowsPerPage && !shouldShow && select}

				<Button
					id="pagination-next-page"
					type="button"
					aria-label="Next Page"
					aria-disabled={disabledGreater}
					onClick={handleNext}
					disabled={disabledGreater}
					$isRTL={isRTL}
				>
					{paginationIconNext}
				</Button>

				<Button
					id="pagination-last-page"
					type="button"
					aria-label="Last Page"
					aria-disabled={disabledGreater}
					onClick={handleLast}
					disabled={disabledGreater}
					$isRTL={isRTL}
				>
					{paginationIconLastPage}
				</Button>
			</PageList>
		</PaginationWrapper>
	);
}

export default React.memo(Pagination);
