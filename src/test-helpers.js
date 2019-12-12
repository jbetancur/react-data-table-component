import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import 'jest-styled-components';
import theme from './theme/default';

export const renderWithTheme = (tree, ...args) =>
  render(<ThemeProvider theme={theme()}>{tree}</ThemeProvider>, ...args);

