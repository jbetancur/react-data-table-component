import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTableContext } from './DataTableContext';
import Select from './Select';
import { getNumberOfPages } from './util';

const defaultComponentOptions = {
  rowsPerPageText: 'Rows per page:',
  rangeSeparatorText: 'of',
  noRowsPerPage: false,
};

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
  transition: 0.3s;

  svg {
    fill: ${props => props.theme.pagination.buttonFontColor};
  }

  &:disabled {
    opacity: 0.4;
    cursor: unset;
  }

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.pagination.buttonHoverBackground};
  }
`;

const PageList = styled.div`
  display: flex;
  border-radius: 4px;
  white-space: nowrap;
  direction: ltr;
`;

const Span = styled.span`
  flex-shrink: 1;
  user-select: none;
  font-size: ${props => props.theme.pagination.fontSize};
  color: ${props => props.theme.pagination.fontColor};
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
  theme,
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

  return (
    <>
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
          theme={theme}
        >
          {paginationIconFirstPage}
        </Button>

        <Button
          id="pagination-previous-page"
          onClick={handlePrevious}
          disabled={disabledLesser}
          theme={theme}
        >
          {paginationIconPrevious}
        </Button>

        <Button
          id="pagination-next-page"
          onClick={handleNext}
          disabled={disabledGreater}
          theme={theme}
        >
          {paginationIconNext}
        </Button>

        <Button
          id="pagination-last-page"
          onClick={handleLast}
          disabled={disabledGreater}
          theme={theme}
        >
          {paginationIconLastPage}
        </Button>
      </PageList>
    </>
  );
};

Pagination.propTypes = {
  rowsPerPage: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  currentPage: PropTypes.number.isRequired,
};

export default Pagination;
