[![Build Status](https://travis-ci.org/jbetancur/react-data-table-component.svg?branch=master)](https://travis-ci.org/jbetancur/react-data-table-component)

[React Data Table Component Demo](https://jbetancur.github.io/react-data-table-component)

[![Storybook](https://github.com/storybooks/press/blob/master/badges/storybook.svg)](https://jbetancur.github.io/react-data-table-component
)
# React Data Table Component

Creating yet another React table library came out of necessity while developing a web application for a growing startup. I discovered that while there are some great table libraries already available, most required heavy customization or lacked basic features such as built in sorting and pagination, and in some cases required a restrictive license.

If you want to achieve balance with the force and want a simple but flexible table library give React Data Table Component a chance. If you require an Excel clone and need to pivot large data sets then this is not the React table library you are looking for 👋

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
  * React 16.3+
  * styled-components 3.2.3+ || 4.0.0+

If you need to have backwards compatability with React versions previous to 16.3 you will have to `yarn add react-data-table-component@0.13.0`. 

** Note that versions previous to react-data-table-component@1.0.0` are  deprecated and will no longer be maintained. **

## Installation
React Data Table requires the wonderful `styled-components` library. If you've already installed `styled-components` there is no need to install it again.

```
npm install react-data-table-component styled-components
```

or

```
yarn add react-data-table-component styled-components
```

## API/Usage

### Columns
Nothing new here - we are using an array of object literals and properties to describle the columns:

| Property | Type   | Required | Example                                                                                                       |
|----------|--------|----------|---------------------------------------------------------------------------------------------------------------|
| name     | string | no       | the display name of our Column e.g. 'Name'                                                                    |
| selector | string | yes      | the propery in the data set e.g.  `property1.nested1.nested2`.                                                |
| sortable | bool   | no       | if the column is sortable                                                                                     |
| format   | func   | no       | format the selector e.g. `row => moment(row.timestamp).format('lll')`                                         |
| cell     | func   | no       | for ultimate control use `cell` to render your own custom component! e.g `row => <h2>{row.title}</h2>`  **Negates  `format`** |
| grow     | number | no       | [flex-grow](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-grow) of the column.  the is useful if you want a column to take up more width than its relatives (without having to set widths explicitly).  this will be affected by other columns where you have explicitly set widths |
| width    | string | no       | give the column a fixed width                                                                                 |
| minWidth | string | no       | give the column a minWidth                                                                                    |
| maxWidth | string | no       | give the column a maxWidth                                                                                    |
| right    | bool   | no       | right aligns the content in the cell. usefil for numbers                                                      |
| center   | bool   | no       | center aligns the content in the cell                                                                         |
| compact  | bool   | no       | reduces the padding in the cell. useful for custom cells icons or buttons                                     |
| button   | bool   | no       | applies additional styling when using a button                                                                |
| wrap     | bool   | no       | whether the cell content shold be allowed to wrap.                                                            |
| allowOverflow  | bool   | no       | allows content in the cell to overflow. useful for menus/layovers that do not rely on "smart" positioning                                     |
| ignoreRowClick   | bool | no | prevents the `onRowClicked` event from being passed on a specific TableCell column. This is **really** useful for a menu or button where you do not want the `onRowClicked` triggered

### DataTable Properties
| Property | Type | Required | Default | Description |
|--------------------------|---------------------|----------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| title | string or component | no |  | The Title displayed in the Table Header |
| columns | array<Columns> | yes | [] | The column configuration |
| data | array<Object> | no | [] | it is **highly recommended** that your data has a unique identifier (keyField). The default `keyField` is `id`. If you need to override this value then see `keyField` [DataTable Properties](dataTable-properties). |
| keyField | string | no | 'id' | your data should have a unique identifier. By default, React Data Table looks for an `id` property for each item in your data. You must match `keyField` to your identifier key, especially if you want to manage row state at a later time or use the expander feature. If a unique `id` is not present, React Data Table will use the row index (not recommended) as the key value |
| progressPending | bool | no |  | disables the table and displays a plain text Loading Indicator |
| progressComponent | component | no |  | allows you to use your own custom progress component |
| progressCentered | bool | no |  | absolutely position and center the progress over the table |
| selectableRows | bool | no | false | Whether to show selectable checkboxes |
| selectableRowsComponent | func | no |  | Override the default checkbox component - must be passed as a function (e.g. `Checkbox` not `<Checkbox />`) |
| selectableRowsComponentProps | object | no |  | Additional props you want to pass to `selectableRowsComponent`. See [Advanced Selectable Component Options](#advanced-selectable-component-options) to learn how you can override indeterminate state |
| expandableRows | bool | no | false | Whether to make a row expandable, if true it requires an `expandableRowsComponent`. It is **highly recommended** your data set have a unique identifier defined as the `keyField` for row expansion to work properly.
| expandableRowsComponent | string or component | no |  | A custom component to display in the expanded row. It will have the `data` prop composed  so that you may access the row data |
| noDataComponent | string or component | no |  | A custom component to display when there are no records to display
| sortIcon | component | no |  | Override the default sort icon - the icon must be a font or svg icon and it should be a "downward" icon since animation will be handled by React Data Table  |
| striped | bool | no | false | stripe color the odd rows |
| highlightOnHover | bool | no | false | if rows are to be highlighted on hover |
| pointerOnHover | bool | no | false | if rows show a point icon on hover |
| actions | array of components | no |  | add actions to the TableHeader |
| contextTitle | string | no |  | override the context menu title |
| contextActions | array of components | no |  | add context action as an array of components |
| onTableUpdate | func | no |  | callback to access the entire Data Table state ({ allSelected, selectedCount, selectedRows, sortColumn, sortDirection, rows }) |
| onRowClicked | func | no | | callback to access the row data,index on row click |
| clearSelectedRows | bool | no | false | toggling this property clears the selectedRows. If you use redux or react state you need to make sure that you pass a toggled value or the component will not update. See [Clearing Selected Rows](#clearing-selected-rows)|
| defaultSortField | string | no |  | Setting this ensures the table data is presorted before it renders and the field(selector) is focused |
| defaultSortAsc | bool | no | true  | set this to false if you want the table data to be sorted in DESC order |
| className | string | no |  | override the className on the Table wrapper |
| style | object | no |  | override the style on the Table wrapper |
| overflowY | bool | no | false | if a table is responsive, items such as layovers/menus/dropdowns will be clipped on the last row(s) due to to [overflow-x-y behavior](https://www.brunildo.org/test/Overflowxy2.html) - setting this value ensures there is invisible space below the table to prevent "clipping". However, if possible, the **correct approach is to use menus/layovers/dropdowns that support smart positioning**. **If used, the table parent element must have a fixed `height` or `height: 100%`**. |
| overflowYOffset | string | no | 250px | used with overflowY to "fine tune" the offset |
| responsive | bool | no | true | makes the table horizontally scrollable on smaller screen widths |
| customTheme | object | no |  | Override the [default theme](https://github.com/jbetancur/react-data-table-component/blob/master/src/themes/default.js), by overriding specifc props. Your changes will be merged. [See Theming](#theming) for more information |
| disabled | bool | no | false | disables the Table section |
| noHeader | bool | no | false | removes the table header. `title`, `contextTitle` and `contextActions` will be ignored |
| fixedHeader | bool | no | false | makes the table header fixed allowing you to scroll the table body |
| pagination | bool | no | false | enable pagination with defaults |
| paginationPerPage | number | no | 10 | rows per page |
| paginationRowsPerPageOptions | number | no | [10, 15, 20, 25, 30] | row page dropdown selection options |
| onChangePage | func | no | null | callback when paged that returns the current Page |
| onChangeRowsPerPage | func | no | null | callback when rows per page is changed that returns the new rows per page|
| paginationComponent | func | no | Pagination | a component that overrides the default paginator component |
| paginationIconFirstPage |  | no | JSX | a component that overrides the first page icon for the pagination |
| paginationIconLastPage |  | no | JSX | a component that overrides the last page icon for the pagination |
| paginationIconNext |  | no | JSX | a component that overrides the next page icon for the pagination |
| paginationIconPrevious |  | no | JSX | a component that overrides the previous page icon for the pagination |
  
#### Advanced Selectable Component Options
Sometimes 3rd party checkbox components have their own way of handling indeterminate state. We don't want React Data Table hardcoded to a specific ui lib or custom component, so instead a "hook" is provided to allow you to pass a function that will be resolved by React Data Table's internal `Checkbox` for use with `indeterminate` functionality.

Example Usage:

```js

const { Checkbox } from 'react-md';

...

/* 
  In this example, the react-md ui lib determines its own indeterminate state via the `uncheckedIcon` property. 
  Let's override it. React Data Table is made aware if a checkbox is indetermite or not becuase internally we can resolve this   as `yourfunction(checkboxawareindeterminatestate)`
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

const data = [{ title: 'Conan the Barbarian', year: '1982' } ...];
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
          onTableUpdate={handleChange}
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
        onTableUpdate={handleChange}
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
      sortIcon={<FontIcon>arrow_downward</FontIcon>} // use a material icon for our sort icon
      onTableUpdate={handleChange}
    />
    )
  }
);
```

## Custom Cells
Let's give our Movie list a summary, but in the same cell as `Name`:
```js
....

const data = [{ title: 'Conan the Barbarian', summary: 'Orphaned boy Conan is enslaved after his village is destroyed...',  year: '1982' } ...];
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
        onTableUpdate={handleChange}
      />
    )
  }
);
```


## Expandable Rows
Let's make our rows expandable so we can view more details:
```js
...

const data = [{ title: 'Conan the Barbarian', summary: 'Orphaned boy Conan is enslaved after his village is destroyed...',  year: '1982', image: 'http://conan.image.png' } ...];
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
        onTableUpdate={handleChange} 
        expandableRows
        expandableRowsComponent={<ExpanableComponent />}
      />
    )
  }
);
```

## Theming
Under Development

The curent default Theme is very "material". Near term plans are to have 3 built-in prop selectable themes (none, bootstrap, material).

You can override or replace the current theme using the `customTheme` prop

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

Refer to [Default Theme](https://github.com/jbetancur/react-data-table-component/blob/master/src/themes/default.js) for reference


### Theme Resources
* [SVG Encoder](https://codepen.io/yoksel/details/JDqvs)


# Development

## Setup

Install the latest [Node JS LTS](https://nodejs.org/) and [Yarn](https://yarnpkg.com) and simply run ```yarn``` or ```yarn install``` command in the root and stories directory.

## Installing Flow Types

Install flowtypes using the package script:
```sh
yarn flow-typed
```

> It is advised to run the script whenever NPM packages are installed.

## Local development

During development,
```sh
# watch and build new source changes
yarn start
# or serve *.stories.js files and manually test on the Storyboard app
yarn storyboard
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

## Static Types

```sh
yarn flow # performs type checking on files
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
