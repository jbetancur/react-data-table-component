import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { handleFunctionProps, noop } from './util';

const calculateBaseStyle = disabled => ({
  fontSize: '18px',
  ...!disabled && { cursor: 'pointer' },
  padding: 0,
  marginLeft: '8px',
  verticalAlign: 'middle',
  position: 'relative',
});

const Checkbox = ({
  component,
  componentOptions,
  indeterminate,
  checked,
  name,
  onClick,
  disabled,
}) => {
  const setCheckboxRef = checkbox => {
    if (checkbox) {
      // eslint-disable-next-line no-param-reassign
      checkbox.indeterminate = indeterminate;
    }
  };

  const TagName = component;
  const baseStyle = TagName !== 'input' ? componentOptions.style : calculateBaseStyle(disabled);
  const resolvedComponentOptions = useMemo(() => handleFunctionProps(componentOptions, indeterminate), [componentOptions, indeterminate]);

  return (
    <TagName
      // allow this component to fully control these options
      type="checkbox"
      ref={setCheckboxRef}
      style={baseStyle}
      onClick={disabled ? noop : onClick}
      name={name}
      aria-label={name}
      checked={checked}
      disabled={disabled}
      {...resolvedComponentOptions}
      onChange={noop} // prevent uncontrolled checkbox warnings -  we don't need onChange
    />
  );
};

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  indeterminate: PropTypes.bool,
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
  ]),
  componentOptions: PropTypes.object,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

Checkbox.defaultProps = {
  indeterminate: false,
  component: 'input',
  componentOptions: {
    style: {},
  },
  checked: false,
  disabled: false,
  onClick: null,
};

export default Checkbox;
