import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { handleFunctionProps } from './util';

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
    componentOptions: {
      style: {},
    },
    data: {},
    index: null,
    style: null,
  };

  componentDidMount() {
    const { indeterminate } = this.props;

    this.el.indeterminate = indeterminate;
  }

  componentDidUpdate(prevProps) {
    const { indeterminate } = this.props;

    if (prevProps.indeterminate !== indeterminate) {
      this.el.indeterminate = indeterminate;
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
      ...rest
    } = this.props;

    const TagName = component || 'input';
    const baseStyle = TagName !== 'input' ? componentOptions.style : baseCheckboxStyle;
    const resolvedComponentOptions = handleFunctionProps(componentOptions, indeterminate);

    return (
      <TagName
        type="checkbox"
        {...rest}
        {...resolvedComponentOptions}
        // allow this component to fully control these options
        ref={el => { this.el = el; }}
        style={baseStyle}
        onClick={this.handleClick}
        onChange={() => null} // prevent uncontrolled checkbox warnings -  we don't need onChange
      />
    );
  }
}
