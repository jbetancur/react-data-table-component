import React, { PureComponent, createContext } from 'react';
import PropTypes from 'prop-types';
import { defaultProps } from './propTypes';

const {
  keyField,
  selectableRowsComponent,
  selectableRowsComponentProps,
  expandableIcon,
  paginationTotalRows,
  paginationRowsPerPageOptions,
  paginationIconLastPage,
  paginationIconFirstPage,
  paginationIconNext,
  paginationIconPrevious,
  paginationComponentOptions,
} = defaultProps;

export const defaultState = {
  selectedRows: [],
  indeterminate: false,
  keyField,
  selectableRowsComponent,
  selectableRowsComponentProps,
  expandableIcon,
  paginationTotalRows,
  paginationRowsPerPageOptions,
  paginationIconLastPage,
  paginationIconFirstPage,
  paginationIconNext,
  paginationIconPrevious,
  paginationComponentOptions,
};

export const DataTableContext = createContext(defaultState);

export class DataTableProvider extends PureComponent {
  static propTypes = {
    initialState: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
  };

  render() {
    const { children, initialState } = this.props;

    return (
      <DataTableContext.Provider value={initialState}>
        {children}
      </DataTableContext.Provider>
    );
  }
}

export const DataTableConsumer = DataTableContext.Consumer;
