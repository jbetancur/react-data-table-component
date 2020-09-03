import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTableContext } from './DataTableContext';
import Select from './Select';
import { getNumberOfPages, detectRTL } from './util';
import useWindowSize from '../hooks/useWindowSize';
import { media, SMALL } from './media';

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
  ${props => props.theme.pagination.style};
`;

const Button = styled.button`
  position: relative;
  display: block;
  user-select: none;
  border: none;
  ${props => props.theme.pagination.pageButtonsStyle};
  ${props => props.isRTL && 'transform: scale(-1, -1)'};
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

const Pagination = ({
  rowsPerPage,
  rowCount,
  onChangePage,
  onChangeRowsPerPage,
  currentPage,
}) => {
  const {
    direction,
    paginationRowsPerPageOptions,
    paginationIconLastPage,
    paginationIconFirstPage,
    paginationIconNext,
    paginationIconPrevious,
    paginationComponentOptions,
  } = useTableContext();
  const windowSize = useWindowSize();
  const shouldShow = windowSize.width > SMALL;
  const isRTL = detectRTL(direction);
  const numPages = getNumberOfPages(rowCount, rowsPerPage);
  const lastIndex = currentPage * rowsPerPage;
  const firstIndex = (lastIndex - rowsPerPage) + 1;
  const disabledLesser = currentPage === 1;
  const disabledGreater = currentPage === numPages;
  const options = { ...defaultComponentOptions, ...paginationComponentOptions };
  const range = currentPage === numPages
    ? `${firstIndex}-${rowCount} ${options.rangeSeparatorText} ${rowCount}`
    : `${firstIndex}-${lastIndex} ${options.rangeSeparatorText} ${rowCount}`;

  const handlePrevious = useCallback(() => onChangePage(currentPage - 1), [currentPage, onChangePage]);
  const handleNext = useCallback(() => onChangePage(currentPage + 1), [currentPage, onChangePage]);
  const handleFirst = useCallback(() => onChangePage(1), [onChangePage]);
  const handleLast = useCallback(() => onChangePage(getNumberOfPages(rowCount, rowsPerPage)), [onChangePage, rowCount, rowsPerPage]);
  const handleRowsPerPage = useCallback(({ target }) => onChangeRowsPerPage(Number(target.value), currentPage), [currentPage, onChangeRowsPerPage]);

  const selectOptions = paginationRowsPerPageOptions.map(num => (
    <option
      key={num}
      value={num}
    >
      {num}
    </option>
  ));

  if (options.selectAllRowsItem) {
    selectOptions.push(
      (
        <option
          key={-1}
          value={rowCount}
        >
          {options.selectAllRowsItemText}
        </option>
      ),
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
      {shouldShow && (
        <Range>
          {range}
        </Range>
      )}
      <PageList>
        <Button
          id="pagination-first-page"
          type="button"
          aria-label="First Page"
          aria-disabled={disabledLesser}
          onClick={handleFirst}
          disabled={disabledLesser}
          isRTL={isRTL}
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
          isRTL={isRTL}
        >
          {paginationIconPrevious}
        </Button>

        {!shouldShow && select}

        <Button
          id="pagination-next-page"
          type="button"
          aria-label="Next Page"
          aria-disabled={disabledGreater}
          onClick={handleNext}
          disabled={disabledGreater}
          isRTL={isRTL}
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
          isRTL={isRTL}
        >
          {paginationIconLastPage}
        </Button>
      </PageList>
    </PaginationWrapper>
  );
};

Pagination.propTypes = {
  rowsPerPage: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
};

export default Pagination;
