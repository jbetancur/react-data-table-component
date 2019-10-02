import React, { Component } from 'react'
import { render } from 'react-dom'
import styled from 'styled-components';
import { getProperty } from './util';

const ExportGroupStyle = styled.div`
    position:relative;
    float:right;
`;

const ExportButtonStyle = styled.button`
    display: inline-block;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    color: #fff;
    background-color: #6c757d;
    border-color: #6c757d;
    border: 1px solid transparent;
    padding: .375rem .75rem;
    padding-bottom: .3rem;
    font-size: .86rem;
    border-radius: .25rem;
    cursor: pointer;
    outline: none;
    &:after {
      display: inline-block;
      margin-left: .5em;
      vertical-align: .16em;
      content: "";
      border-top: .3em solid;
      border-right: .3em solid transparent;
      border-bottom: 0;
      border-left: .3em solid transparent;
    }
`;
const ExportDropdownStyle = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 1000;
    float: left;
    min-width: 5.6rem;
    padding: .2rem 0;
    margin: .125rem 0 0;
    font-size: 1rem;
    color: #212529;
    text-align: left;
    list-style: none;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0,0,0,.15);
    border-radius: .25rem;
    display: ${props => (props.show ? 'block' : 'none')};
}
> a {
  display: block;
  width: 100%;
  padding: .4rem .9rem .4em 2.4rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  white-space: nowrap;
  border: 0;
  text-decoration: none;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAzElEQVQ4T+3TP1JCMRDH8Q/jBajtvIUlJZ2tBwBrG/6UlCoU1HgBWzs6oOMWdtZcgIFZJk8zmfcEx9ZtNtns75vNJmn5o7XO6Mc44Lkp7yfACE9JGOOXOkgTYIgeNknUwQLTElIHGKCPED0kwStWCTLLISXgBu/o4hOTlBz+Gkvc4aOC1FVwhX0mjGEFytdOKeduIa+g9iL+Ad9NvMUj7otOtdN8V8TfMMe2amI8muh4+EtsnfLXOSDefVlBEywqiI/2BYgjRPA3Fpttj1+6JBGSfdGFAAAAAElFTkSuQmCC);
  background-position: .6rem .4em;
  background-repeat: no-repeat;
  &:hover {
    background-color: #f1f1f1;
  }
}
`;

export class ExportTable extends Component {

  constructor(props) {
    super(props)

    this.state = {
      dropdown: false
    }

    this.ExportHelper = {
      fileName: (ext) => {
        return (props.exportFileName ? `${props.exportFileName}.${ext}` : `${document.title}.${ext}`);
      },
      download: (content, type, fileName) => {

        const file = new Blob(["\ufeff", content], { type: type });
        const link = document.createElement("a");

        link.id = "_export_datatable_" + fileName;
        link.download = fileName;
        link.href = window.URL.createObjectURL(file);

        document.body.appendChild(link);

        link.click();
        document.getElementById(link.id).remove();
      }
    }

    this.ExportFile = {
      csv: (data, header) => {
        let contentHeader = (header ? `${header.map(e => e.name).join(";")}\n` : "");
        let content = `${contentHeader}${data.map(e => e.join(";")).join("\n")}`;

        this.ExportHelper.download(content, "text/csv", this.ExportHelper.fileName("csv"));
      },
      excel: (data, header) => {

        let contentHeader = (header ? `<thead><tr><td>${header.map(e => e.name).join("</td><td>")}</td><tr></thead>` : "");
        let contentBody = data.map(e => "<tr><td>" + e.join("</td><td>") + "</td></tr>");
        let table = `<table>${contentHeader}<tbody>${contentBody.join("")}</tbody></table>`;

        this.ExportHelper.download(table, "application/vnd.ms-excel", this.ExportHelper.fileName("xls"));
      }
    };
  }


  onExport(e, type) {

    let exportHeader = [];
    let exportDataKeys = [];
    let exportData = [];

    // column properties and select fields to export
    this.props.columns.forEach(element => {
      if (element.export !== false) {
        exportHeader.push(element);
        exportDataKeys.push(element.selector);
      }
    });

    // get and render data
    this.props.data.forEach(element => {
      const row = []
      exportDataKeys.forEach((key, index) => {

        const header = exportHeader[index];

        // cell: render component and get innerText
        if (header.cell) {

          const div = document.createElement('div');

          render(header.cell(element), div);

          row.push(div.innerText);
        }
        // get property
        else {
          row.push(getProperty(element, header.selector, header.format));
        }

      })
      exportData.push(row);
    });

    // download file
    this.ExportFile[type](exportData, (this.props.exportHeader ? exportHeader : null));

    this.setState({ dropdown: false });
    e.preventDefault();
  }


  render() {
    return (
      <ExportGroupStyle>
        <ExportButtonStyle type="button" onClick={(e) => this.setState(prevState => ({ dropdown: !prevState.dropdown }))}>Export Table</ExportButtonStyle>
        <ExportDropdownStyle show={this.state.dropdown}>
          <a href="#csv" onClick={(e) => this.onExport(e, "csv")}>Csv File</a>
          <a href="#excel" onClick={(e) => this.onExport(e, "excel")}>Excel File</a>
        </ExportDropdownStyle>
      </ExportGroupStyle>

    )
  }
}
