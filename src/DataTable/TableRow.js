import React, { useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { DataTableStateContext } from './DataTableContext';
import TableCell from './TableCell';
import TableCellCheckbox from './TableCellCheckbox';
import TableCellExpander from './TableCellExpander';
import ExpanderRow from './ExpanderRow';

const defaultRowsCSS = css`
  border-top-style: solid;
  border-top-width: ${props => props.theme.rows.borderWidth};
  border-top-color: ${props => props.theme.rows.borderColor};
`;

const spacedRowsCSS = css`
  margin-top: ${props => props.theme.rows.spacingMargin || 0};
  margin-bottom: ${props => props.theme.rows.spacingMargin || 0};
  border-radius: ${props => props.theme.rows.spacingBorderRadius || 0};
  border-style: solid;
  border-width: ${props => props.theme.rows.borderWidth};
  border-color: ${props => props.theme.rows.borderColor};
  ${props => props.theme.rows.spacingShadow && `box-shadow: ${props.theme.rows.spacingShadow}`};
`;

const stripedCSS = css`
  &:nth-child(odd) {
    background-color: ${props => props.theme.rows.stripedColor};
  }
`;

const hightlightCSS = css`
  &:hover {
    color: ${props => props.theme.rows.hoverFontColor};
    background-color: ${props => props.theme.rows.hoverBackgroundColor};
    transition-duration: 0.15s;
    transition-property: background-color;
  }
`;

const pointerCSS = css`
  &:hover {
    cursor: pointer;
  }
`;

const TableRowStyle = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  min-height: ${props => props.theme.rows.height};
  ${props => (props.theme.rows.spacing === 'spaced' ? spacedRowsCSS : defaultRowsCSS)};
  background-color: ${props => props.theme.rows.backgroundColor};
  color: ${props => props.theme.rows.fontColor};
  ${props => props.striped && stripedCSS};
  ${props => props.highlightOnHover && hightlightCSS};
  ${props => props.pointerOnHover && pointerCSS};
`;

const TableRow = ({
  keyField,
  columns,
  row,
  onRowClicked,
  selectableRows,
  expandableRows,
  striped,
  highlightOnHover,
  pointerOnHover,
  expandableRowsComponent,
  expandableDisabledField,
  defaultExpanded,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const { selectedRows } = useContext(DataTableStateContext);
  const isRowSelected = useMemo(() => selectedRows.some(srow => srow === row), [row, selectedRows]);
  const handleRowClick = e => {
    // use event delegation allow events to propogate only when the element with data-tag __react-data-table--click-clip___ is present
    if (e.target && e.target.getAttribute('data-tag') === '___react-data-table--click-clip___') {
      onRowClicked(row, e);
    }
  };

  return (
    <React.Fragment>
      <TableRowStyle
        striped={striped}
        highlightOnHover={highlightOnHover}
        pointerOnHover={pointerOnHover}
        onClick={handleRowClick}
        className="rdt_TableRow"
      >
        {selectableRows && (
          <TableCellCheckbox
            name={`select-row-${row[keyField]}`}
            checked={isRowSelected}
            row={row}
          />
        )}

        {expandableRows && (
          <TableCellExpander
            expanded={expanded}
            row={row}
            onExpandToggled={() => setExpanded(!expanded)}
            disabled={row[expandableDisabledField] || false}
          />
        )}

        {columns.map(column => (
          <TableCell
            key={`cell-${column.id}-${row[keyField]}`}
            column={column}
            row={row}
            rowClickable={!!onRowClicked || column.button}
          />
        ))}
      </TableRowStyle>

      {expandableRows && expanded && (
        <ExpanderRow
          key={`expander--${row[keyField]}`}
          data={row}
        >
          {expandableRowsComponent}
        </ExpanderRow>
      )}
    </React.Fragment>
  );
};

TableRow.propTypes = {
  keyField: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  row: PropTypes.object.isRequired,
  onRowClicked: PropTypes.func.isRequired,
  defaultExpanded: PropTypes.bool.isRequired,
  selectableRows: PropTypes.bool.isRequired,
  expandableRows: PropTypes.bool.isRequired,
  striped: PropTypes.bool.isRequired,
  highlightOnHover: PropTypes.bool.isRequired,
  pointerOnHover: PropTypes.bool.isRequired,
  expandableRowsComponent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
  expandableDisabledField: PropTypes.string.isRequired,
};

export default TableRow;
