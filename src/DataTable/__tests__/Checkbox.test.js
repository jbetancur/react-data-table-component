import 'jest-styled-components';

import React from 'react';
import { mount } from 'enzyme';
import Checkbox from '../Checkbox';

test('component <Checkbox /> should render correctly', () => {
  const wrapper = mount(<Checkbox onClick={jest.fn()} />);

  expect(wrapper).toMatchSnapshot();
});

test('component <Checkbox /> should render correctly when a custom component is not provided', () => {
  const wrapper = mount(<Checkbox onClick={jest.fn()} />);

  expect(wrapper).toMatchSnapshot();
});

test('component <Checkbox component/> should render correctly with a custom checkbox', () => {
  // eslint-disable-next-line react/prefer-stateless-function
  class CustomComp extends React.Component {
    render() {
      return (<div>25 schmeckles</div>);
    }
  }

  const wrapper = mount(<Checkbox onClick={jest.fn()} component={CustomComp} />);

  expect(wrapper).toMatchSnapshot();
});

test('component <Checkbox component/> should render correctly with custom props', () => {
  const wrapper = mount(<Checkbox onClick={jest.fn()} componentOptions={{ test: 'false' }} />);

  expect(wrapper).toMatchSnapshot();
});

test('component <Checkbox indeterminate /> should toggle indeterminate to true on the element', () => {
  const wrapper = mount(<Checkbox onClick={jest.fn()} indeterminate />);
  wrapper.instance().componentDidUpdate({ indeterminate: false });

  expect(wrapper.instance().el.indeterminate).toBe(true);
});

test('component <Checkbox indeterminate={false} /> should not toggle indeterminate if theere is no change', () => {
  const wrapper = mount(<Checkbox onClick={jest.fn()} indeterminate={false} />);
  wrapper.instance().componentDidUpdate({ indeterminate: false });
  expect(wrapper.instance().el.indeterminate).toBe(false);
});

test('component <Checkbox /> should handle onClick', () => {
  const mockCallBack = jest.fn();
  const wrapper = mount(<Checkbox data={{ name: 'morty' }} index={1} onClick={mockCallBack} />);
  wrapper.simulate('click');

  expect(mockCallBack).toBeCalled();
});
