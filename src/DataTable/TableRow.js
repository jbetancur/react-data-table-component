import React, { memo, useCallback, useState } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import TableCell from "./TableCell";
import TableCellCheckbox from "./TableCellCheckbox";
import TableCellExpander from "./TableCellExpander";
import ExpanderRow from "./ExpanderRow";
import { getConditionalStyle } from "./util";

const STOP_PROP_TAG = "___react-data-table-allow-propagation___";

const defaultRowsCSS = css`
  &:not(:first-child) {
    border-top-style: ${props => props.theme.rows.borderStyle};
    border-top-width: ${props => props.theme.rows.borderWidth};
    border-top-color: ${props => props.theme.rows.borderColor};
  }
`;

const spacedRowsCSS = css`
  margin-top: ${props => props.theme.rows.spacingMargin || 0};
  margin-bottom: ${props => props.theme.rows.spacingMargin || 0};
  border-radius: ${props => props.theme.rows.spacingBorderRadius || 0};
  border-style: ${props => props.theme.rows.borderStyle};
  border-width: ${props => props.theme.rows.borderWidth};
  border-color: ${props => props.theme.rows.borderColor};
  ${props =>
    props.theme.rows.spacingShadow &&
    `box-shadow: ${props.theme.rows.spacingShadow}`};
`;

const stripedCSS = css`
  &:nth-child(odd) {
    background-color: ${props => props.theme.rows.stripedColor};
  }
`;

const highlightCSS = css`
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
  flex-wrap: wrap;
  align-items: stretch;
  align-content: stretch;
  width: 100%;
  box-sizing: border-box;
  min-height: ${props =>
    props.dense ? props.theme.rows.denseHeight : props.theme.rows.height};
  ${props =>
    props.theme.rows.spacing === "spaced" ? spacedRowsCSS : defaultRowsCSS};
  background-color: ${props => props.theme.rows.backgroundColor};
  color: ${props => props.theme.rows.fontColor};
  ${props => props.striped && stripedCSS};
  ${props => props.highlightOnHover && highlightCSS};
  ${props => props.pointerOnHover && pointerCSS};
  ${props => props.extendedRowStyle};
`;

const TableRow = memo(
  ({
    tableId,
    index,
    id,
    keyField,
    columns,
    row,
    onRowClicked,
    onRowDoubleClicked,
    selectableRows,
    expandableRows,
    striped,
    highlightOnHover,
    pointerOnHover,
    dense,
    expandableRowsComponent,
    expandableDisabledField,
    defaultExpanded,
    expandOnRowClicked,
    expandOnRowDoubleClicked,
    conditionalRowStyles
  }) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const handleExpanded = useCallback(() => {
      setExpanded(!expanded);
    }, [expanded]);

    const disableRowClick = row[expandableDisabledField] || false;
    const showPointer =
      pointerOnHover ||
      (expandableRows && (expandOnRowClicked || expandOnRowDoubleClicked));

    const handleRowClick = useCallback(
      e => {
        // use event delegation allow events to propagate only when the element with data-tag ___react-data-table-allow-propagation___ is present
        if (e.target && e.target.getAttribute("data-tag") === STOP_PROP_TAG) {
          onRowClicked(row, e);

          if (!disableRowClick && expandableRows && expandOnRowClicked) {
            handleExpanded();
          }
        }
      },
      [
        disableRowClick,
        expandOnRowClicked,
        expandableRows,
        handleExpanded,
        onRowClicked,
        row
      ]
    );

    const handleRowDoubleClick = useCallback(
      e => {
        if (e.target && e.target.getAttribute("data-tag") === STOP_PROP_TAG) {
          onRowDoubleClicked(row, e);
          if (!disableRowClick && expandableRows && expandOnRowDoubleClicked) {
            handleExpanded();
          }
        }
      },
      [
        disableRowClick,
        expandOnRowDoubleClicked,
        expandableRows,
        handleExpanded,
        onRowDoubleClicked,
        row
      ]
    );

    const extendedRowStyle = getConditionalStyle(row, conditionalRowStyles);
    let columnIndex = 0;
    const rowId = `${tableId}-row-${id}`;
    return (
      <TableRowStyle
        role="row"
        aria-rowindex={index}
        id={rowId}
        striped={striped}
        highlightOnHover={highlightOnHover}
        pointerOnHover={!disableRowClick && showPointer}
        dense={dense}
        onClick={handleRowClick}
        onDoubleClick={handleRowDoubleClick}
        className="rdt_TableRow"
        extendedRowStyle={extendedRowStyle}
      >
        {selectableRows && (
          <TableCellCheckbox
            index={++columnIndex}
            id={`${tableId}-selector-${id}`}
            key={`selector-${id}`}
            name={`select-row-${row[keyField]}`}
            row={row}
          />
        )}

        {expandableRows && (
          <TableCellExpander
            index={++columnIndex}
            id={`${tableId}-expander-${id}`}
            key={`expander-${id}`}
            expanded={expanded}
            row={row}
            onExpandToggled={handleExpanded}
            disabled={disableRowClick}
          />
        )}

        {columns.map(column => (
          <TableCell
            index={++columnIndex}
            rowId={rowId}
            id={`${tableId}-cell-${id}-${columnIndex}`}
            key={`cell-${id}-${columnIndex}`}
            column={column}
            row={row}
          />
        ))}

        {expandableRows && expanded && (
          <ExpanderRow id={`${tableId}-expanded-content-${id}`} index={++columnIndex} key={`expanded-content-${row[keyField]}`} data={row}>
            {expandableRowsComponent}
          </ExpanderRow>
        )}
      </TableRowStyle>
    );
  }
);

TableRow.propTypes = {
  id: PropTypes.any.isRequired,
  keyField: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  row: PropTypes.object.isRequired,
  onRowClicked: PropTypes.func.isRequired,
  onRowDoubleClicked: PropTypes.func.isRequired,
  defaultExpanded: PropTypes.bool.isRequired,
  selectableRows: PropTypes.bool.isRequired,
  expandableRows: PropTypes.bool.isRequired,
  striped: PropTypes.bool.isRequired,
  highlightOnHover: PropTypes.bool.isRequired,
  pointerOnHover: PropTypes.bool.isRequired,
  dense: PropTypes.bool.isRequired,
  expandableRowsComponent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func
  ]).isRequired,
  expandableDisabledField: PropTypes.string.isRequired,
  expandOnRowClicked: PropTypes.bool.isRequired,
  expandOnRowDoubleClicked: PropTypes.bool.isRequired,
  conditionalRowStyles: PropTypes.array.isRequired
};

export default TableRow;
