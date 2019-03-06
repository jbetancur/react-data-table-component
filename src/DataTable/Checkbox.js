import React, { PureComponent, createRef } from 'react';
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
    style: PropTypes.object,
  };

  static defaultProps = {
    indeterminate: false,
    component: 'input',
    componentOptions: {
      style: {},
    },
    data: {},
    style: null,
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
      ...rest
    } = this.props;
    const TagName = component;
    const baseStyle = TagName !== 'input' ? componentOptions.style : baseCheckboxStyle;
    const resolvedComponentOptions = handleFunctionProps(componentOptions, indeterminate);

    return (
      <TagName
        type="checkbox"
        {...rest}
        {...resolvedComponentOptions}
        // allow this component to fully control these options
        ref={this.checkbox}
        style={baseStyle}
        onClick={this.handleClick}
        onChange={() => null} // prevent uncontrolled checkbox warnings -  we don't need onChange
      />
    );
  }
}
