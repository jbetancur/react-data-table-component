import React, { PureComponent, createContext } from 'react';
import PropTypes from 'prop-types';
import { defaultProps } from './propTypes';

export const defaultState = {
  columns: [],
  selectedRows: [],
  internalCell: false,
  ...defaultProps,
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
