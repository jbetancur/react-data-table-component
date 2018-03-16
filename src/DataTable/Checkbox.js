import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const baseCheckboxStyle = { fontSize: '18px', cursor: 'pointer' };

export default class Checkbox extends PureComponent {
  static propTypes = {
    indeterminate: PropTypes.bool,
    component: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.func,
    ]),
    onClick: PropTypes.func.isRequired,
    componentOptions: PropTypes.object,
    data: PropTypes.object,
    index: PropTypes.number,
    style: PropTypes.object,
  };

  static defaultProps = {
    indeterminate: false,
    component: 'input',
    componentOptions: {},
    data: {},
    index: null,
    style: null,
  };

  componentDidMount() {
    this.el.indeterminate = this.props.indeterminate;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.indeterminate !== this.props.indeterminate) {
      this.el.indeterminate = this.props.indeterminate;
    }
  }

  handleClick = e => {
    const { onClick, data, index } = this.props;

    onClick(data, index, e);
  }

  render() {
    // remove indeterminate to prevent browser warnings
    const {
      component,
      componentOptions,
      indeterminate,
      style,
      ...rest
    } = this.props;

    const TagName = component || 'input';
    const baseStyle = TagName === 'input' ? baseCheckboxStyle : style;

    return (
      <TagName
        {...rest}
        {...componentOptions}
        type="checkbox"
        ref={el => { this.el = el; }}
        onClick={this.handleClick}
        onChange={() => null} // prevent uncontrolled checbox warnings - also we don't need onChange
        style={baseStyle}
      />
    );
  }
}
