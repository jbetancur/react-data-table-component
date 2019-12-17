import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import 'jest-styled-components';
import { generateStyles } from './theme/default';

export const renderWithTheme = (tree, ...args) =>
  render(<ThemeProvider theme={generateStyles()}>{tree}</ThemeProvider>, ...args);
