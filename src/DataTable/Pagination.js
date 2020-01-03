import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTableContext } from './DataTableContext';
import Select from './Select';
import { getNumberOfPages, detectRTL } from './util';

const defaultComponentOptions = {
  rowsPerPageText: 'Rows per page:',
  rangeSeparatorText: 'of',
  noRowsPerPage: false,
};

const PaginationWrapper = styled.footer`
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
  outline: none;
  user-select: none;
  cursor: pointer;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  height: 40px;
  width: 40px;
  padding: 8px;
  margin: 2px;
  ${props => props.theme.pagination.pageButtonsStyle};
  ${props => props.isRTL && 'transform: scale(-1, -1)'};
`;

const PageList = styled.div`
  display: flex;
  border-radius: 4px;
  white-space: nowrap;
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
    paginationRowsPerPageOptions,
    paginationIconLastPage,
    paginationIconFirstPage,
    paginationIconNext,
    paginationIconPrevious,
    paginationComponentOptions,
  } = useTableContext();
  const numPages = getNumberOfPages(rowCount, rowsPerPage);
  const lastIndex = currentPage * rowsPerPage;
  const firstIndex = (lastIndex - rowsPerPage) + 1;
  const disabledLesser = currentPage === 1;
  const disabledGreater = currentPage === numPages;
  const { rowsPerPageText, rangeSeparatorText, noRowsPerPage } = { ...defaultComponentOptions, ...paginationComponentOptions };
  const range = currentPage === numPages
    ? `${firstIndex}-${rowCount} ${rangeSeparatorText} ${rowCount}`
    : `${firstIndex}-${lastIndex} ${rangeSeparatorText} ${rowCount}`;

  const handlePrevious = useCallback(() => onChangePage(currentPage - 1), [currentPage, onChangePage]);
  const handleNext = useCallback(() => onChangePage(currentPage + 1), [currentPage, onChangePage]);
  const handleFirst = useCallback(() => onChangePage(1), [onChangePage]);
  const handleLast = useCallback(() => onChangePage(getNumberOfPages(rowCount, rowsPerPage)), [onChangePage, rowCount, rowsPerPage]);
  const handleRowsPerPage = useCallback(({ target }) => onChangeRowsPerPage(Number(target.value), currentPage), [currentPage, onChangeRowsPerPage]);
  const isRTL = detectRTL();

  return (
    <PaginationWrapper className="rdt_Pagination">
      {!noRowsPerPage && (
        <>
          <RowLabel>{rowsPerPageText}</RowLabel>
          <Select onChange={handleRowsPerPage} defaultValue={rowsPerPage}>
            {paginationRowsPerPageOptions.map(num => (
              <option
                key={num}
                value={num}
              >
                {num}
              </option>
            ))}
          </Select>
        </>
      )}
      <Range>
        {range}
      </Range>
      <PageList>
        <Button
          id="pagination-first-page"
          onClick={handleFirst}
          disabled={disabledLesser}
          isRTL={isRTL}
        >
          {paginationIconFirstPage}
        </Button>

        <Button
          id="pagination-previous-page"
          onClick={handlePrevious}
          disabled={disabledLesser}
          isRTL={isRTL}
        >
          {paginationIconPrevious}
        </Button>

        <Button
          id="pagination-next-page"
          onClick={handleNext}
          disabled={disabledGreater}
          isRTL={isRTL}
        >
          {paginationIconNext}
        </Button>

        <Button
          id="pagination-last-page"
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
