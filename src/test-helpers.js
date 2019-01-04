import React from 'react';
import { render } from 'react-testing-library';
import { ThemeProvider } from 'styled-components';
import 'jest-styled-components';
import theme from './themes/default';

export const renderWithTheme = tree =>
  render(<ThemeProvider theme={theme}>{tree}</ThemeProvider>);
