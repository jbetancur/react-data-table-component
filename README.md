[![Build Status](https://travis-ci.org/jbetancur/react-data-table-component.svg?branch=master)](https://travis-ci.org/jbetancur/react-data-table-component) [![npm version](https://badge.fury.io/js/react-data-table-component.svg)](https://badge.fury.io/js/react-data-table-component) [![codecov](https://codecov.io/gh/jbetancur/react-data-table-component/branch/master/graph/badge.svg)](https://codecov.io/gh/jbetancur/react-data-table-component) [![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://jbetancur.github.io/react-data-table-component)

# React Data Table Component

Creating yet another React table library came out of necessity while developing a web application for a growing startup. I discovered that while there are some great table libraries out there, some required heavy customization, were missing out of the box features such as built in sorting and pagination, or required understanding the atomic structure of html tables.

If you want to achieve balance with the force and want a simple but flexible table library give React Data Table Component a chance. If you require an Excel clone or heavy "enterprise" capabilities, then this is not the React table library you are looking for 👋

## Table of Contents

* [Features](#key-features)
* [Demo & Examples](#demo-and-examples)
* [Requirements](#requirements)
* [Installation](#installation)
* [Issues/Contributing](#logging-issues-and-contributions)
* [API](#api-and-usage)
  * [Defining Columns](#columns)
  * [DataTable Properties](#datatable-properties)
* [Basic Table](#basic-table)
* [Selectable Rows](#selectable-rows)
* [Custom Cells](#custom-cells)
* [Expandable Rows](#expandable-rows)
* [Optimizing for Performance and Caveats](#optimizing-for-performance-and-caveats)
* [Theming](#theming)
* [CSS Overrides](#css-overrides)

## Demo and Examples

[React Data Table Component Demo](https://jbetancur.github.io/react-data-table-component)

## Key Features

* Declarative Configuration
* Sortable (client)
* Selectable Rows
* Expandable Rows
* Themeable via js config
* Data Aware (i.e. easily callback to a parent component get the DataTable state, e.g. `selectedRows`
* Responsive (via x-scroll/flex)
* Pagination

## Requirements
React Data Table Component requires the following be installed in your project:
  * React 16.8.0+
  * styled-components 3.2.3+ || 4.0.0+ || 5.0.0+

## Installation
React Data Table requires the wonderful `styled-components` library. If you've already installed `styled-components` there is no need to install it again.

```
npm install react-data-table-component styled-components
```

or

```
yarn add react-data-table-component styled-components
```

## Logging Issues and Contributions
Please use the github issue templates feature for logging issues or feature proposals. Including a codesandbox and providing clear details on the feature/issue will elicit a much quicker response 😉

## API and Usage

### Columns
Nothing new here - we are using an array of object literals and properties to describle the columns:

| Property | Type   | Required | Example                                                                                                       |
|----------|--------|----------|---------------------------------------------------------------------------------------------------------------|
| name     | string | no       | the display name of our Column e.g. 'Name'                                                                    |
| selector | string | yes      | a data set property in dot notation. e.g. <br /> `property1.nested1.nested2` <br /> `property1.items[0].nested2` |
| sortable | bool   | no       | if the column is sortable                                                                                     |
| format   | func   | no       | format the selector e.g. `row => moment(row.timestamp).format('lll')`                                         |
| cell     | func   | no       | for ultimate control use `cell` to render your own custom component! e.g `row => <h2>{row.title}</h2>` <br /> **negates  `format`** |
| grow     | number | no       | [flex-grow](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-grow) of the column.  the is useful if you want a column to take up more width than its relatives (without having to set widths explicitly).  this will be affected by other columns where you have explicitly set widths |
| width    | string | no       | give the column a fixed width                                                                                 |
| minWidth | string | no       | give the column a minWidth                                                                                    |
| maxWidth | string | no       | give the column a maxWidth                                                                                    |
| right    | bool   | no       | right aligns the content in the cell. useful for numbers                                                      |
| center   | bool   | no       | center aligns the content in the cell                                                                         |
| compact  | bool   | no       | reduces the padding in the cell by 50%                                     |
| ignoreRowClick   | bool | no | prevents the `onRowClicked` and `onRowDoubleClicked` event from being passed on the specific TableCell column. This is **really** useful for a menu or button where you do not want the `onRowClicked` triggered, such as when using `onRowClicked` for navigation or routing |
| button   | bool   | no       | this is like `ignoreRowClick` except it will apply additional styling for button placement. you do not need to set `ignoreRowClick` when using `button` |
| wrap     | bool   | no       | whether the cell content should be allowed to wrap.                                                            |
| allowOverflow  | bool   | no       | allows content in the cell to overflow. useful for menus/layovers that do not rely on "smart" positioning |
| hide   | integer or string preset (`sm`, `md`, `lg`) | no | specify a screen size (breakpoint) as an integer (in pixels) that hides the column when resizing the browser window. You can also use the preset values of: `sm` (small), `md`(medium), and `lg`(large) |

#### column.hide media presets
When the breakpoint is reached the column will be hidden. These are the built-in media breakpoint presets when hiding columns

| Value   | Breakpoint  | Description               |
| ------- | ----------- | ------------------------- |
| sm      | 599px       | small (phones)            |
| md      | 959px       | medium(landscape tablets) |
| lg      | 1280px      | large(laptops/desktops)   |


### DataTable Properties

#### Basic
| Property | Type | Required | Default | Description |
|--------------------------|---------------------|----------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| title | string or component | no |  | The Title displayed in the Table Header |
| columns | array<Columns> | yes | [] | The column configuration |
| data | array<Object> | no | [] | it is **highly recommended** that your data has a unique identifier (keyField). The default `keyField` is `id`. If you need to override this value then see `keyField` [DataTable Properties](dataTable-properties). |
| keyField | string | no | 'id' | your data should have a unique identifier. By default, React Data Table looks for an `id` property for each item in your data. You must match `keyField` to your identifier key, especially if you want to manage row state at a later time or use the expander feature. If a unique `id` is not present, React Data Table will use the row index (not recommended) as the key value |
| striped | bool | no | false | stripe color the odd rows |
| highlightOnHover | bool | no | false | if rows are to be highlighted on hover |
| pointerOnHover | bool | no | false | if rows show a point icon on hover |
| noDataComponent | string or component | no |  | A custom component to display when there are no records to display |
| className | string | no |  | override the className on the Table wrapper |
| style | object | no |  | override the style on the Table wrapper |
| responsive | bool | no | true | makes the table horizontally scrollable on smaller screen widths |
| customTheme | object | no |  | Override the [default theme](https://github.com/jbetancur/react-data-table-component/blob/master/src/themes/default.js), by overriding specific props. Your changes will be merged. [See Theming](#theming) for more information |
| disabled | bool | no | false | disables the Table section |
| onRowClicked | func | no | | callback to access the row data,index on row click |
| onRowDoubleClicked | func | no | | callback to access the row data,index on row double click |
| overflowY | bool | no | false | if a table is responsive, items such as layovers/menus/dropdowns will be clipped on the last row(s) due to to [overflow-x-y behavior](https://www.brunildo.org/test/Overflowxy2.html) - setting this value ensures there is invisible space below the table to prevent "clipping". However, if possible, the **correct approach is to use menus/layovers/dropdowns that support smart positioning**. **If used, the table parent element must have a fixed `height` or `height: 100%`**. |
| overflowYOffset | string | no | 250px | used with overflowY to "fine tune" the offset |
| dense           | bool   | no | false | compacts the row height. can be overridden via theming `rows.denseHeight`. note that if any custom elements exceed the dense height then the row will only compact to the tallest element any of your cells |
| noTableHead | bool | no | false | hides the the sort columns and titles (TableHead) - this will obviously negate sorting |

#### Progress Indicator
| Property | Type | Required | Default | Description |
|--------------------------|---------------------|----------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| progressPending | bool | no |  | disables the table and displays a plain text Loading Indicator |
| progressComponent | component | no |  | allows you to use your own custom progress component |
| progressCentered | bool | no |  | absolutely position and center the progress over the table |

#### Row Selection
| Property | Type | Required | Default | Description |
|--------------------------|---------------------|----------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| selectableRows | bool | no | false | Whether to show selectable checkboxes |
| selectableRowsNoSelectAll | bool | no | false | Whether to show the select all rows checkbox |
| clearSelectedRows | bool | no | false | toggling this property clears the selectedRows. If you use redux or react state you need to make sure that you pass a toggled value or the component will not update. See [Clearing Selected Rows](#clearing-selected-rows)|
| onRowSelected | func | no |  | callback to access the row selected state ({ allSelected, selectedCount, selectedRows }). <br /> **note** It's highly recommended that you memoize the callback that you pass to `onRowSelected` if it updates the state of your parent component. This prevents `DataTable` from unnecessary re-renders every time your parent component is re-rendered |
| selectableRowsComponent | func | no |  | Override the default checkbox component - must be passed as a function (e.g. `Checkbox` not `<Checkbox />`) |
| selectableRowsComponentProps | object | no |  | Additional props you want to pass to `selectableRowsComponent`. See [Advanced Selectable Component Options](#advanced-selectable-component-options) to learn how you can override indeterminate state |
| selectableRowsPreSelectedField | string | no |  | a `bool` field on your data set that controls whether a row is pre-selected. **note** this field can only be one level deep |
| selectableRowsDisabledField | string | no |  | a `bool` field on your data set that controls whether a row can be selected. **note** this field can only be one level deep |

#### Row Expander
| Property | Type | Required | Default | Description |
|--------------------------|---------------------|----------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| expandableRows | bool | no | false | Whether to make a row expandable, if true it requires an `expandableRowsComponent`. It is **highly recommended** your data set have a unique identifier defined as the `keyField` for row expansion to work properly.
| expandableIcon | object | no | default expander icons | you may pass in your own custom icons using the `expandableIcon: { collapsed: <svg>...</svg>, expanded: <svg>...</svg>` |
| expandableDisabledField | string | no |  | React Data Table looks for this property in each item from your data and checks if that item can be expanded or not. You must set a bool value in the `expandableDisabledField` of your data if you want to use this feature. **note** this field can only be one level deep
| defaultExpandedField | string | no |  | React Data Table looks for this property in each item from your data and checks if that item should be expanded on initial render. You must set a `bool` value in the `defaultExpandedField` field of your data if you want to use this feature. **note** this field can only be one level deep
| expandableRowsComponent | string or component | no |  | A custom component to display in the expanded row. It will have the `data` prop composed  so that you may access the row data |
| expandOnRowClicked | bool | false |  | The default behavior is to expand the row when the expander button is clicked. `expandOnRowClicked` allows expanding the row when an area within the row is clicked. Requires `expandableRows` be set to true |
| expandOnRowDoubleClicked | bool | false |  | The default behavior is to expand the row when the expander button is clicked. `expandOnRowDoubleClicked` allows expanding the row when an area within the row is double clicked. Requires `expandableRows` be set to true |

#### Sorting
| Property | Type | Required | Default | Description |
|--------------------------|---------------------|----------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| defaultSortField | string | no |  | setting this ensures the table data is presorted before it renders and the field(selector) is focused |
| defaultSortAsc | bool | no | true  | set this to false if you want the table data to be sorted in DESC order |
| sortIcon | component | no |  | override the default sort icon - the icon must be a font or svg icon and it should be a "downward" icon since animation will be handled by React Data Table |
| onSort | func | no |  | callback to access the sort state when a column is clicked. returns ([column](https://github.com/jbetancur/react-data-table-component#columns), sortDirection, event) |
| sortFunction | func | no |  | pass in your own custom sort function e.g. `(rows, field, direction) => {...yourSortLogicHere}. you must return an array |
| sortServer   | bool | no | false | disables internal sorting for use with server-side sorting or when you want to manually control the sort behavior. place your sorting logic and/or api calls in an `onSort` handler. note that `sortFunction` is a better choice if you simply want to override the internal sorting behavior |

#### Pagination
| Property | Type | Required | Default | Description |
|--------------------------|---------------------|----------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| pagination | bool | no | false | enable pagination with defaults. by default the total record set will be sliced depending on the page, rows per page. if you wish to use server side pagination then use the `paginationServer` property |
| paginationServer | bool | no | false | changes the default pagination to work with server side pagination |
| paginationDefaultPage | number | no | 1 | the default page to use when the table initially loads |
| paginationTotalRows | number | no | 0 | allows you to provide the total row count for your table as represented by your API when performing server side pagination. if this property is not provided then react-data-table will use `data.length` |
| paginationPerPage | number | no | 10 | the default rows per page to use when the table initially loads |
| paginationRowsPerPageOptions | number | no | [10, 15, 20, 25, 30] | row page dropdown selection options |
| onChangePage | func | no | null | callback when paged that returns `onChangePage(page, totalRows)` |
| onChangeRowsPerPage | func | no | null | callback when rows per page is changed returns `onChangeRowsPerPage(currentRowsPerPage, currentPage)` |
| paginationComponent | func | no | Pagination | a component that overrides the default pagination component |
| paginationComponentOptions | object | no | See Description | overridable options for the built in pagination component. If you are developing a custom pagination component you can use `paginationComponentOptions` to pass in your own custom props. Defaults to: ```{ rowsPerPageText: 'Rows per page:', rangeSeparatorText: 'of' }```|
| paginationIconFirstPage |  | no | JSX | a component that overrides the first page icon for the pagination |
| paginationIconLastPage |  | no | JSX | a component that overrides the last page icon for the pagination |
| paginationIconNext |  | no | JSX | a component that overrides the next page icon for the pagination |
| paginationIconPrevious |  | no | JSX | a component that overrides the previous page icon for the pagination |

#### Header
| Property | Type | Required | Default | Description |
|--------------------------|---------------------|----------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| actions | component or array of components | no |  | add actions to the TableHeader |
| contextTitle | string | no |  | override the context menu title |
| contextActions | component or array of components| no |  | add context actions to the TableHeader context|
| noHeader | bool | no | false | removes the table header. `title`, `contextTitle` and `contextActions` will be ignored |
| fixedHeader | bool | no | false | makes the table header fixed allowing you to scroll the table body |
| fixedHeaderScrollHeight | string | no | 100vh | in order for fixedHeader to work this property allows you to set a static height to the TableBody. height must be a fixed value |
| subHeader | component or array of components | no | false | show a sub header between the table and table header
| subHeaderAlign | string | no | right | align the sub header content (left, right, center)
| subHeaderWrap | bool | no | true | whether the sub header content should wrap
| subHeaderComponent |  component or array of components | no | [] | a component you want to render |

#### Advanced Selectable Component Options
Sometimes 3rd party checkbox components have their own way of handling indeterminate state. We don't want React Data Table hard coded to a specific ui lib or custom component, so instead a "hook" is provided to allow you to pass a function that will be resolved by React Data Table's internal `Checkbox` for use with `indeterminate` functionality.

Example Usage:

```js

const { Checkbox } from 'react-md';

...

/*
  In this example, the react-md ui lib determines its own indeterminate state via the `uncheckedIcon` property.
  Let's override it. React Data Table is made aware if a checkbox is indeterminate or not because internally we can resolve this   as `yourfunction(checkboxawareindeterminatestate)`
*/

const handleIndeterminate = isIndeterminate => (isIndeterminate ? <FontIcon>indeterminate_check_box</FontIcon> : <FontIcon>check_box_outline_blank</FontIcon>);

const MyComponent = () => (
  <DataTable
    title="Arnold Movies"
    columns={columns}
    data={data}
    selectableRows
    selectableRowsComponent={Checkbox} // Pass the function only
    selectableRowsComponentProps={{ uncheckedIcon: handleIndeterminate  }}
  />
);
```
**Note** This is currently only supported for indeterminate state, but may be expanded in the future if there is a demand

## Basic Table
The following declarative structure creates a sortable table of Arnold movie titles:

```js
import DataTable from 'react-data-table-component';

const data = [{ id: 1, title: 'Conan the Barbarian', year: '1982' } ...];
const columns = [
  {
    name: 'Title',
    selector: 'title',
    sortable: true,
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
    right: true,
  },
];

class MyComponent extends Component {
  render() {
    return (
      <DataTable
        title="Arnold Movies"
        columns={columns}
        data={data}
      />
    )
  }
);

```

## Selectable Rows
Let's make our rows selectable so we can access the selected results

```js
...

const handleChange = (state) => {
  // You can use setState or dispatch with something like Redux so we can use the retrieved data
  console.log('Selected Rows: ', state.selectedRows);
};

class MyComponent extends Component {
  render() {
      return (
        <DataTable
          title="Arnold Movies"
          columns={columns}
          data={data}
          selectableRows // add for checkbox selection
          onRowSelected={handleChange}
        />
    )
  }
);
```

### Clearing Selected Rows
We need some hook to trigger all the selectedRows to clear. If you were building your own table component, you would manage the selected rows state in some parent component, however, in our case, since we to keep row management within React Data Table, a `clearSelectedRows` prop is provided so you can pass a toggled state.

It will be up to you to make sure you do not pass the same state twice. For example, if you set `clearSelectedRows={true}` twice, on the second update/trigger, none the rows will not be cleared.

```js
...
// set the initial state
state = { toggledClearRows: false }
...

const handleChange = (state) => {
  // You can use setState or dispatch with something like Redux so we can use the retrieved data
  console.log('Selected Rows: ', state.selectedRows);
};

// Toggle the state so React Table Table changes to `clearSelectedRows` are triggered
const handleClearRows = () => {
  this.setState({ toggledClearRows: !this.state.toggledClearRows})
}

class MyComponent extends Component {
  render() {
    return (
      <DataTable
        title="Arnold Movies"
        columns={columns}
        data={data}
        selectableRows // add for checkbox selection
        onRowSelected={handleChange}
        clearSelectedRows={this.state.toggledClearRows}
      />
    )
  }
);
```

### Overriding with a 3rd Party Ui Component Library
Don't like those ugly html checkboxes? Let's override them with some [react-md](https://react-md.mlaursen.com) sexyiness. While we are at it we will also override the `sortIcon`:

```js
...
import { Checkbox, FontIcon } from 'react-md';
...

class MyComponent extends Component {
  render() {
    return (
      title="Arnold Movies"
      columns={columns}
      data={data}
      selectableRows
      selectableRowsComponent={Checkbox} // Pass the function only
      selectableRowsComponentProps={{ inkDisabled: true }} // optionally, pass react-md supported props down to our custom checkbox
      sortIcon={<FontIcon>arrow_downward</FontIcon>} // use a material icon for our sort icon. rdt will rotate the icon 180 degrees
      onRowSelected={handleChange}
    />
    )
  }
);
```

## Custom Cells
Let's give our Movie list a summary, but in the same cell as `Name`:
```js
....

const data = [{ id: 1, title: 'Conan the Barbarian', summary: 'Orphaned boy Conan is enslaved after his village is destroyed...',  year: '1982' } ...];
const columns = [
  {
    name: 'Title',
    sortable: true,
    cell: row => <div><div style={{ fontWeight: bold }}>{row.title}</div>{row.summary}</div>,
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
    right: true,
  },
];

...

class MyComponent extends Component {
  render() {
    return (
      <DataTable
        title="Arnold Movies"
        columns={columns}
        data={data}
        selectableRows
        selectableRowsComponent={Checkbox}
        selectableRowsComponentProps={{ inkDisabled: true }}
        sortIcon={<FontIcon>arrow_downward</FontIcon>}
        onRowSelected={handleChange}
      />
    )
  }
);
```

## Expandable Rows
Let's make our rows expandable so we can view more details:
```js
...

const data = [{ id: 1, title: 'Conan the Barbarian', summary: 'Orphaned boy Conan is enslaved after his village is destroyed...',  year: '1982', image: 'http://conan.image.png' } ...];
const columns = [
  {
    name: 'Title',
    sortable: true,
    cell: row => <div><div style={{ fontWeight: 700 }}>{row.title}</div>{row.summary}</div>,
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
    right: true,
  },
];

...

// The row data is composed into your custom expandable component via the data prop
const ExpanableComponent = ({ data }) => <img src={data.image} />;

class MyComponent extends Component {
  render() {
    return (
      <DataTable
        title="Arnold Movies"
        columns={columns}
        data={data}
        selectableRows
        selectableRowsComponent={Checkbox}
        selectableRowsComponentProps={{ inkDisabled: true }}
        sortIcon={<FontIcon>arrow_downward</FontIcon>}
        onRowSelected={handleChange}
        expandableRows
        expandableRowsComponent={<ExpanableComponent />}
      />
    )
  }
);
```

But in some cases we don't have more details to show:
```js
...

const data = [{ id: 1, title: 'Conan the Barbarian', summary: 'Orphaned boy Conan is enslaved after his village is destroyed...',  year: '1982', expanderDisabled: true, image: 'http://conan.image.png' } ...];
const columns = [
  {
    name: 'Title',
    sortable: true,
    cell: row => <div><div style={{ fontWeight: 700 }}>{row.title}</div>{row.summary}</div>,
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
    right: true,
  },
];

...

// The row data is composed into your custom expandable component via the data prop
const ExpanableComponent = ({ data }) => <img src={data.image} />;

class MyComponent extends Component {
  render() {
    return (
      <DataTable
        title="Arnold Movies"
        columns={columns}
        data={data}
        selectableRows
        selectableRowsComponent={Checkbox}
        selectableRowsComponentProps={{ inkDisabled: true }}
        sortIcon={<FontIcon>arrow_downward</FontIcon>}
        onRowSelected={handleChange}
        expandableRows
        expandableDisabledField="expanderDisabled"
        expandableRowsComponent={<ExpanableComponent />}
      />
    )
  }
);
```

## Optimizing for Performance and Caveats
Pre-optimizaton can be the root of all evil, however, there are some best practices you can adhere to that will ensure React Data Table (RDT) is giving you the performance that you expect.

### Passing non-primitive props (objects, arrays and functions)
While RDT has internal optimizations to try and prevent re-renders on deeper internal components, it's up to you to make sure that you understand how React manages rendering when props/state change as well as how JavaScript determines equality for non-primitives. As a general rule, or if you are experiencing performance issues you should ensure that any non-primitive property that's passed into RDT is not re-created on every render cycyle. This is even more important when you have larger data sets or you are passing complex components and columns to `DataTable`.

#### Optimizing Class Components
You can typically achieve this by moving props such as objects, arrays, functions or other React components that you pass to RDT outside of the `render` method. Additionally, RDT provides you with a `memoize` helper for cases where you are using a function to generate those values.

##### Examples of Optimizations
The following component will cause RDT to fully re-render every time `onRowSelected` is triggered. Why? Because when `setState` is called it triggers `myComponent` to re-render which by design triggers a re-render on all child components i.e. `DataTable`. But luckily for you React optimally handles this decision on when and how to re-render `DataTable` and a full re-render should not occur **as long as `DataTable` props are the same**.

However, in the example below `columns` changes on every re-render because it's being re-created. This is due to referential equality checking, simply: `columns[] !== columns[]`. In other words, while both instances of `columns` contain the same elements, they are "different" arrays.

**Bad**
```js
...
import React, { Component } from 'react';
import DataTable from 'react-data-table';

class MyComponent extends Component {
  updateState = state => {
    this.setState({ selectedRows: state.selectedRows }); // triggers MyComponent to re-render with new state
  }

  render () { // by design runs on every setState trigger
    // upon re-render columns array is recreated and thus causes DataTable to re-render
    const columns = [....];

    return (
      <DataTable
        data={data}
        columns={columns}
        onRowSelected={this.updateState}
        selectableRows
      />
    )
  }
}
```

A "solution" could be to declare any field that is a non primitive field outside of the render function so that it does not get recreated on every re-render cycle:

**Good**
```js
...
import React, { Component } from 'react';
import DataTable from 'react-data-table';

const columns = [....]; // is only created once

class MyComponent extends Component {
  updateState = state => {
    this.setState({ selectedRows: state.selectedRows });
  }

  render () {

    return (
      <DataTable
        data={data}
        columns={columns}
        onRowSelected={this.updateState}
        selectableRows
      />
    )
  }
}

```

But that only works if you don't need to pass component props/methods to the column object. For example what if you want to attach an event handler to a button in the row using `column.cell`?

```js
const columns = [;
  {
    cell: () => <Button raised primary onClick={this.handleAction}>Action</Button>,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
  ...
];
```

So how do we attach event handlers to our columns without having to place it in the `render` method and dealing with unnecessary re-renders?

1. Create a `columns` function and pass the arguments needed
2. Memoize the `columns` function

This way, when React checks if `columns` has changed `columns` will instead be the cached result (remember referential equality), thus no unnecessary re-render.

Got it? Let's try this again with the optimal solution:

```js
import React, { Component } from 'react';
import DataTable, { memoize } from 'react-data-table';

const columns = memoize(handleAction => [
  ...
  {
    cell: () => <Button raised primary onClick={handleAction}>Action</Button>,
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
  ...
]);

class MyComponent extends Component {
  updateState = state => {
    this.setState({ selectedRows: state.selectedRows });
  }

  render () {
    return (
      <DataTable
        data={data}
        columns={columns(this.updateState)}
        onRowSelected={this.updateState}
        selectableRows
      />
    );
  }
}
```

Notice that `this.updateState` does not require memoization. That's because `this.updateState` is defined as a class method and therefore only created once. This however, is a different matter with functional components.

#### Optimizing Functional Components
If you're building functional components in React 16.8+ you get access to React Hooks such as `useMemo` and `useCallback`. In this example, simply wrap `columns` in a `useMemo` callback and your `updateState` into `useCallback`:

```js
import React, { useState, useMemo } from 'react';
import DataTable from 'react-data-table';

const MyComponentHook = () => {
  const [thing, setThing] = useState();
  const handleAction = value => setThing(value);
  // unlike class methods updateState will be re-created on each render pass, therefore, make sure that callbacks passed to onRowSelected are memoized using useCallback
  const updateState = useCallback(state => console.log(state));
  const columns = useMemo(() => [
    ...
    {
      cell: () => <Button raised primary onClick={handleAction}>Action</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    ...
  ]);

  return (
    <DataTable
      data={data}
      columns={columns}
      onRowSelected={updateState}
      selectableRows
    />
  );
}
```

## Theming
You can override or replace the default theme using the `customTheme` prop. Internally, this just deep merges your theme with the default theme.

For Example:

```js
// Override the row default height
const mySweetTheme = {
  rows: {
    height: '64px'
  }
}

class MyComponent extends Component {
  render() {
    return (
      <DataTable
        title="Arnold Movies"
        columns={columns}
        customTheme={mySweetTheme}
      />
    )
  }
);
```

Refer to [Default Theme](https://github.com/jbetancur/react-data-table-component/blob/master/src/themes/default.js) for reference and avaiilable properties to override

## CSS Overrides
If you would like to customize the layout components of React Data Table using styled-components (e.g. `styled(DataTable)`), or your favorite CSS, SCSS, LESS, etc.. pre-processor you may use the following classNames:

* rdt_Table
* rdt_TableRow
* rdt_TableCol
* rdt_TableCol_Sortable
* rdt_TableCell
* rdt_TableHeader
* rdt_TableFooter
* rdt_TableHead
* rdt_TableHeadRow
* rdt_TableBody
* rdt_ExpanderRow

# Development

## Setup
Install the latest [Node JS LTS](https://nodejs.org/) and [Yarn](https://yarnpkg.com) and simply run `yarn` or `yarn install` command in the root and stories directory.

> It is advised to run the script whenever NPM packages are installed.

## Local development
During development,
```sh
# watch and build new source changes
yarn start
# or serve *.stories.js files and manually test on the Storybook app
yarn storybook
```

## Including NPM packages
This project uses two package.json structure.

### Library dependencies -- <root_dir>/package.json

```sh
yarn add [package-name] --dev # for dev tools
yarn add [package-name] # for app
```

### Storybook dependencies -- <root_dir>/stories/package.json

```sh
cd stories/
yarn add [package-name]
```

## Lint
```sh
yarn lint # runs linter to detect any style issues (css & js)
yarn lint:css # lint only css
yarn lint:js # lint only js
yarn lint:js --fix # tries to fix js lint issues
```

## Test
```sh
yarn test # runs functional/unit tests using Jest
yarn test --coverage # with coverage
```

## Build
```sh
yarn build # builds sources at src/
```
