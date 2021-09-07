import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import 'jest-styled-components';
import { createStyles } from '../DataTable/styles';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderWithTheme = (tree: React.ReactElement, ...args: RenderOptions[]): RenderResult =>
	render(<ThemeProvider theme={createStyles({}, 'default')}>{tree}</ThemeProvider>, ...args);
