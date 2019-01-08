import 'jest-styled-components';
import React from 'react';
import { cleanup, fireEvent } from 'react-testing-library';
import { renderWithTheme } from '../../test-helpers';
import Select from '../Select';

afterEach(cleanup);

test('should render correctly with default props', () => {
  const { container } = renderWithTheme(
    <Select onChange={jest.fn()} defaultValue={1}>
      <option value={1}>
        {1}
      </option>
      ))
    </Select>,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test('should call onChange if a change is triggered', () => {
  const onChangeMock = jest.fn();
  const { container } = renderWithTheme(
    <Select onChange={onChangeMock} defaultValue={1}>
      <option value={1}>
        1
      </option>

      <option value={2}>
        2
      </option>
      ))
    </Select>,
  );

  fireEvent.change(container.querySelector('select'), { target: { value: 2 } });

  expect(onChangeMock).toBeCalled();
});
