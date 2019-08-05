import React from 'react';
import PropTypes from 'prop-types';
import FirstPageIcon from '../icons/FirstPage';
import LastPageIcon from '../icons/LastPage';
import LeftIcon from '../icons/Left';
import RightIcon from '../icons/Right';
import ExpanderCollapsedIcon from '../icons/ExpanderCollapsedIcon';
import ExpanderExpandedIcon from '../icons/ExpanderExpandedIcon';

export const propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  selectableRows: PropTypes.bool,
  expandableRows: PropTypes.bool,
  expandableDisabledField: PropTypes.string,
  defaultExpandedField: PropTypes.string,
  keyField: PropTypes.string,
  progressPending: PropTypes.bool,
  progressComponent: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
  ]),
  progressCentered: PropTypes.bool,
  expandableRowsComponent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]),
  expandableIcon: PropTypes.shape({
    collapsed: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.func,
    ]),
    expanded: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.func,
    ]),
  }),
  selectableRowsComponent: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
  ]),
  selectableRowsComponentProps: PropTypes.object,
  customTheme: PropTypes.object,
  sortIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  sortFunction: PropTypes.func,
  onSort: PropTypes.func,
  striped: PropTypes.bool,
  highlightOnHover: PropTypes.bool,
  pointerOnHover: PropTypes.bool,
  actions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  contextTitle: PropTypes.string,
  contextActions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onTableUpdate: PropTypes.func,
  onRowSelected: PropTypes.func,
  clearSelectedRows: PropTypes.bool,
  defaultSortField: PropTypes.string,
  defaultSortAsc: PropTypes.bool,
  columns: PropTypes.array,
  data: PropTypes.array,
  className: PropTypes.string,
  style: PropTypes.object,
  responsive: PropTypes.bool,
  overflowY: PropTypes.bool,
  overflowYOffset: PropTypes.string,
  noDataComponent: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
  ]),
  disabled: PropTypes.bool,
  noHeader: PropTypes.bool,
  subHeader: PropTypes.bool,
  subHeaderAlign: PropTypes.string,
  subHeaderWrap: PropTypes.bool,
  subHeaderComponent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]),
  onRowClicked: PropTypes.func,
  fixedHeader: PropTypes.bool,
  fixedHeaderScrollHeight: PropTypes.string,
  pagination: PropTypes.bool,
  paginationServer: PropTypes.bool,
  paginationDefaultPage: PropTypes.number,
  paginationTotalRows: PropTypes.number,
  paginationPerPage: PropTypes.number,
  paginationRowsPerPageOptions: PropTypes.array,
  onChangePage: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
  paginationComponent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]),
  paginationComponentOptions: PropTypes.object,
  paginationIconFirstPage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
  ]),
  paginationIconLastPage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
  ]),
  paginationIconNext: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
  ]),
  paginationIconPrevious: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
  ]),
  selctableRowsDisabledField: PropTypes.string,
};

export const defaultProps = {
  title: '',
  keyField: 'id',
  selectableRows: false,
  expandableRows: false,
  expandableDisabledField: '',
  defaultExpandedField: '',
  progressPending: false,
  progressComponent: <h2>Loading...</h2>,
  progressCentered: false,
  expandableRowsComponent: <div>Add a custom expander component. Use props.data for row data</div>,
  expandableIcon: {
    collapsed: <ExpanderCollapsedIcon />,
    expanded: <ExpanderExpandedIcon />,
  },
  selectableRowsComponent: 'input',
  selectableRowsComponentProps: {},
  customTheme: {},
  sortIcon: false,
  sortFunction: null,
  onSort: () => null,
  striped: false,
  highlightOnHover: false,
  pointerOnHover: false,
  contextTitle: '',
  contextActions: [],
  onTableUpdate: null,
  onRowSelected: () => null,
  clearSelectedRows: false,
  defaultSortField: null,
  defaultSortAsc: true,
  columns: [],
  data: [],
  className: null,
  style: {},
  responsive: true,
  overflowY: false,
  overflowYOffset: '250px',
  noDataComponent: 'There are no records to display',
  disabled: false,
  noHeader: false,
  subHeader: false,
  subHeaderAlign: 'right',
  subHeaderWrap: true,
  subHeaderComponent: [],
  onRowClicked: () => null,
  fixedHeader: false,
  fixedHeaderScrollHeight: '100vh',
  pagination: false,
  paginationServer: false,
  paginationDefaultPage: 1,
  paginationTotalRows: 0,
  paginationPerPage: 10,
  paginationRowsPerPageOptions: [10, 15, 20, 25, 30],
  onChangePage: () => null,
  onChangeRowsPerPage: () => null,
  paginationComponent: null,
  paginationComponentOptions: {
    rowsPerPageText: 'Rows per page:',
    rangeSeparatorText: 'of',
  },
  paginationIconFirstPage: <FirstPageIcon />,
  paginationIconLastPage: <LastPageIcon />,
  paginationIconNext: <RightIcon />,
  paginationIconPrevious: <LeftIcon />,
  selctableRowsDisabledField: '',
};
