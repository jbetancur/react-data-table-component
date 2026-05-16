import React from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { StylesContext } from '../context/StylesContext';

export const renderWithTheme = (tree: React.ReactElement, ...args: RenderOptions[]): RenderResult =>
	render(<StylesContext.Provider value={{}}>{tree}</StylesContext.Provider>, ...args);
