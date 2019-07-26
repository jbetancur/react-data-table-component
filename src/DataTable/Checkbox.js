import React, { PureComponent, createRef } from 'react';
import PropTypes from 'prop-types';
import { handleFunctionProps } from './util';

const baseCheckboxStyle = { fontSize: '18px', cursor: 'pointer', marginLeft: '9px' };

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
    style: PropTypes.object,
    checked: PropTypes.bool,
    name: PropTypes.string.isRequired,
  };

  static defaultProps = {
    indeterminate: false,
    component: 'input',
    componentOptions: {
      style: {},
    },
    data: {},
    style: null,
    checked: false,
  };

  constructor(props) {
    super(props);

    this.checkbox = createRef();
  }


  componentDidMount() {
    const { indeterminate } = this.props;

    this.checkbox.current.indeterminate = indeterminate;
  }

  componentDidUpdate(prevProps) {
    const { indeterminate } = this.props;

    if (prevProps.indeterminate !== indeterminate) {
      this.checkbox.current.indeterminate = indeterminate;
    }
  }

  handleClick = e => {
    const { onClick, data } = this.props;

    onClick(data, e);
  }

  render() {
    // remove indeterminate to prevent browser warnings
    const {
      component,
      componentOptions,
      indeterminate,
      checked,
      name,
    } = this.props;
    const TagName = component;
    const baseStyle = TagName !== 'input' ? componentOptions.style : baseCheckboxStyle;
    const resolvedComponentOptions = handleFunctionProps(componentOptions, indeterminate);
    return (
      <TagName
        type="checkbox"
        {...resolvedComponentOptions}
        // allow this component to fully control these options
        ref={this.checkbox}
        style={baseStyle}
        onClick={this.handleClick}
        name={name}
        aria-label={name}
        checked={checked}
        onChange={() => null} // prevent uncontrolled checkbox warnings -  we don't need onChange
      />
    );
  }
}
