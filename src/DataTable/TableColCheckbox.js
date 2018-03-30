import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import Checkbox from './Checkbox';

const TableColStyle = styled.div`
  display: flex;
  flex: 0 0 42px;
  align-items: center;
  box-sizing: border-box;
  user-select: none;
  white-space: nowrap;
  height: ${props => props.theme.header.height};
  font-size: ${props => props.theme.header.fontSize};
  color: ${props => props.theme.header.fontColor};
  padding-left: calc(${props => props.theme.cells.cellPadding} / 6);
  padding-left: calc(${props => props.theme.cells.cellPadding} / 6);
`;

class TableCol extends PureComponent {
  static propTypes = {
    checkboxComponent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    checkboxComponentOptions: PropTypes.object,
    checked: PropTypes.bool,
    indeterminate: PropTypes.bool,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    checkboxComponent: null,
    checkboxComponentOptions: {},
    checked: false,
    indeterminate: false,
    onClick: null,
  };

  render() {
    const {
      checked,
      checkboxComponent,
      checkboxComponentOptions,
      indeterminate,
      onClick,
    } = this.props;

    return (
      <TableColStyle>
        <Checkbox
          name="select-all-rows"
          aria-label="select-all-rows"
          component={checkboxComponent}
          componentOptions={checkboxComponentOptions}
          onClick={onClick}
          checked={checked}
          indeterminate={indeterminate}
        />
      </TableColStyle>
    );
  }
}

export default withTheme(TableCol);
