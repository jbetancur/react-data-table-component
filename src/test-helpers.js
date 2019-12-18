import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import 'jest-styled-components';
import { createStyles } from './DataTable/styles';

export const renderWithTheme = (tree, ...args) =>
  render(<ThemeProvider theme={createStyles()}>{tree}</ThemeProvider>, ...args);
