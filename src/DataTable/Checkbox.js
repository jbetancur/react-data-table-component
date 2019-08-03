import React from 'react';
import PropTypes from 'prop-types';
import { handleFunctionProps } from './util';

const baseCheckboxStyle = { fontSize: '18px', cursor: 'pointer', marginLeft: '9px' };

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
  const baseStyle = TagName !== 'input' ? componentOptions.style : baseCheckboxStyle;
  const resolvedComponentOptions = handleFunctionProps(componentOptions, indeterminate);

  return (
    <TagName
      type="checkbox"
      {...resolvedComponentOptions}
      // allow this component to fully control these options
      ref={setCheckboxRef}
      style={baseStyle}
      onClick={onClick}
      name={name}
      aria-label={name}
      checked={checked}
      onChange={() => null} // prevent uncontrolled checkbox warnings -  we don't need onChange
      disabled={(name !== 'select-all-rows') && disabled}
    />
  );
};

Checkbox.propTypes = {
  indeterminate: PropTypes.bool,
  component: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.func,
  ]),
  componentOptions: PropTypes.object,
  checked: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

Checkbox.defaultProps = {
  indeterminate: false,
  component: 'input',
  componentOptions: {
    style: {},
  },
  checked: false,
  onClick: null,
  disabled: false,
};

export default Checkbox;
