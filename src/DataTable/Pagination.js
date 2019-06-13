import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DataTableConsumer } from './DataTableContext';
import Select from './Select';

const Button = styled.button`
  position: relative;
  display: block;
  outline: none !important;
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
  margin-left: 20px;
  white-space: nowrap;
`;

const Span = styled.span`
  flex-shrink: 1;
  font-size: ${props => props.theme.pagination.fontSize};
  color: ${props => props.theme.pagination.fontColor};
`;

export default class Pagination extends PureComponent {
  static propTypes = {
    rowsPerPage: PropTypes.number.isRequired,
    rowCount: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    onChangeRowsPerPage: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
    currentPage: PropTypes.number.isRequired,
  };

  getNumberOfPages() {
    const { rowsPerPage, rowCount } = this.props;

    return Math.ceil(rowCount / rowsPerPage);
  }

  handlePrevious = () => {
    const { onChangePage, currentPage } = this.props;

    onChangePage(currentPage - 1);
  }

  handleNext = () => {
    const { onChangePage, currentPage } = this.props;

    onChangePage(currentPage + 1);
  }

  handleFirst = () => {
    const { onChangePage } = this.props;

    onChangePage(1);
  }

  handleLast = () => {
    const { onChangePage } = this.props;

    onChangePage(this.getNumberOfPages());
  }

  handleRowsPerPage = currentPage => ({ target }) => {
    const { onChangeRowsPerPage } = this.props;

    onChangeRowsPerPage(Number(target.value), currentPage);
  }

  render() {

    const { theme, rowsPerPage, rowsPerPageText, currentPage, rowCount } = this.props;
    const numPages = this.getNumberOfPages();
    const lastIndex = currentPage * rowsPerPage;
    const firstIndex = (lastIndex - rowsPerPage) + 1;
    const status = currentPage === numPages
      ? `${firstIndex}-${rowCount} of ${rowCount}`
      : `${firstIndex}-${lastIndex} of ${rowCount}`;
    const disabledLesser = currentPage === 1;
    const disabledGreater = currentPage === numPages;

    return (
      <DataTableConsumer>
        {({ paginationRowsPerPageOptions, paginationIconLastPage, paginationIconFirstPage, paginationIconNext, paginationIconPrevious }) => (
          <React.Fragment>
            <Span>{rowsPerPageText}</Span>
            <Select onChange={this.handleRowsPerPage(currentPage)} defaultValue={rowsPerPage}>
              {paginationRowsPerPageOptions.map(num => (
                <option
                  key={num}
                  value={num}
                >
                  {num}
                </option>
              ))}
            </Select>
            <Span>
              {status}
            </Span>

            <PageList>
              <Button
                id="pagination-first-page"
                onClick={this.handleFirst}
                disabled={disabledLesser}
                theme={theme}
              >
                {paginationIconFirstPage}
              </Button>

              <Button
                id="pagination-previous-page"
                onClick={this.handlePrevious}
                disabled={disabledLesser}
                theme={theme}
              >
                {paginationIconPrevious}
              </Button>

              <Button
                id="pagination-next-page"
                onClick={this.handleNext}
                disabled={disabledGreater}
                theme={theme}
              >
                {paginationIconNext}
              </Button>

              <Button
                id="pagination-last-page"
                onClick={this.handleLast}
                disabled={disabledGreater}
                theme={theme}
              >
                {paginationIconLastPage}
              </Button>
            </PageList>
          </React.Fragment>
        )}
      </DataTableConsumer>
    );
  }
}
