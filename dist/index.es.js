import*as e from"react";import t from"react";import n,{css as o,ThemeProvider as a}from"styled-components";var l;function r(e,t){return e[t]}function i(e,t){return t.split(".").reduce(((e,t)=>{const n=t.match(/[^\]\\[.]+/g);if(n&&n.length>1)for(let t=0;t<n.length;t++)return e[n[t]][n[t+1]];return e[t]}),e)}function s(e=[],t,n=0){return[...e.slice(0,n),t,...e.slice(n)]}function d(e=[],t,n="id"){const o=e.slice(),a=r(t,n);return a?o.splice(o.findIndex((e=>r(e,n)===a)),1):o.splice(o.findIndex((e=>e===t)),1),o}function c(e){return e.map(((e,t)=>{const n=Object.assign(Object.assign({},e),{sortable:e.sortable||!!e.sortFunction||void 0});return e.id||(n.id=t+1),n}))}function g(e,t){return Math.ceil(e/t)}function p(e,t){return Math.min(e,t)}!function(e){e.ASC="asc",e.DESC="desc"}(l||(l={}));const u=()=>null;function b(e,t=[],n=[]){let o={},a=[...n];return t.length&&t.forEach((t=>{if(!t.when||"function"!=typeof t.when)throw new Error('"when" must be defined in the conditional style object and must be function');t.when(e)&&(o=t.style||{},t.classNames&&(a=[...a,...t.classNames]),"function"==typeof t.style&&(o=t.style(e)||{}))})),{style:o,classNames:a.join(" ")}}function m(e,t=[],n="id"){const o=r(e,n);return o?t.some((e=>r(e,n)===o)):t.some((t=>t===e))}function h(e,t){return t?e.findIndex((e=>w(e.id,t))):-1}function w(e,t){return e==t}function f(e,t){const n=!e.toggleOnSelectedRowsChange;switch(t.type){case"SELECT_ALL_ROWS":{const{keyField:n,rows:o,rowCount:a,mergeSelections:l}=t,r=!e.allSelected,i=!e.toggleOnSelectedRowsChange;if(l){const t=r?[...e.selectedRows,...o.filter((t=>!m(t,e.selectedRows,n)))]:e.selectedRows.filter((e=>!m(e,o,n)));return Object.assign(Object.assign({},e),{allSelected:r,selectedCount:t.length,selectedRows:t,toggleOnSelectedRowsChange:i})}return Object.assign(Object.assign({},e),{allSelected:r,selectedCount:r?a:0,selectedRows:r?o:[],toggleOnSelectedRowsChange:i})}case"SELECT_SINGLE_ROW":{const{keyField:o,row:a,isSelected:l,rowCount:r,singleSelect:i}=t;return i?l?Object.assign(Object.assign({},e),{selectedCount:0,allSelected:!1,selectedRows:[],toggleOnSelectedRowsChange:n}):Object.assign(Object.assign({},e),{selectedCount:1,allSelected:!1,selectedRows:[a],toggleOnSelectedRowsChange:n}):l?Object.assign(Object.assign({},e),{selectedCount:e.selectedRows.length>0?e.selectedRows.length-1:0,allSelected:!1,selectedRows:d(e.selectedRows,a,o),toggleOnSelectedRowsChange:n}):Object.assign(Object.assign({},e),{selectedCount:e.selectedRows.length+1,allSelected:e.selectedRows.length+1===r,selectedRows:s(e.selectedRows,a),toggleOnSelectedRowsChange:n})}case"SELECT_MULTIPLE_ROWS":{const{keyField:o,selectedRows:a,totalRows:l,mergeSelections:r}=t;if(r){const t=[...e.selectedRows,...a.filter((t=>!m(t,e.selectedRows,o)))];return Object.assign(Object.assign({},e),{selectedCount:t.length,allSelected:!1,selectedRows:t,toggleOnSelectedRowsChange:n})}return Object.assign(Object.assign({},e),{selectedCount:a.length,allSelected:a.length===l,selectedRows:a,toggleOnSelectedRowsChange:n})}case"CLEAR_SELECTED_ROWS":{const{selectedRowsFlag:n}=t;return Object.assign(Object.assign({},e),{allSelected:!1,selectedCount:0,selectedRows:[],selectedRowsFlag:n})}case"SORT_CHANGE":{const{sortDirection:o,selectedColumn:a,clearSelectedOnSort:l}=t;return Object.assign(Object.assign(Object.assign({},e),{selectedColumn:a,sortDirection:o,currentPage:1}),l&&{allSelected:!1,selectedCount:0,selectedRows:[],toggleOnSelectedRowsChange:n})}case"CHANGE_PAGE":{const{page:o,paginationServer:a,visibleOnly:l,persistSelectedOnPageChange:r}=t,i=a&&r,s=a&&!r||l;return Object.assign(Object.assign(Object.assign(Object.assign({},e),{currentPage:o}),i&&{allSelected:!1}),s&&{allSelected:!1,selectedCount:0,selectedRows:[],toggleOnSelectedRowsChange:n})}case"CHANGE_ROWS_PER_PAGE":{const{rowsPerPage:n,page:o}=t;return Object.assign(Object.assign({},e),{currentPage:o,rowsPerPage:n})}}}const x=o`
	pointer-events: none;
	opacity: 0.4;
`,C=n.div`
	position: relative;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	max-width: 100%;
	${({disabled:e})=>e&&x};
	${({theme:e})=>e.table.style};
`,y=o`
	position: sticky;
	position: -webkit-sticky; /* Safari */
	top: 0;
	z-index: 1;
`,v=n.div`
	display: flex;
	width: 100%;
	${({fixedHeader:e})=>e&&y};
	${({theme:e})=>e.head.style};
`,R=n.div`
	display: flex;
	align-items: stretch;
	width: 100%;
	${({theme:e})=>e.headRow.style};
	${({dense:e,theme:t})=>e&&t.headRow.denseStyle};
`,S=(e,...t)=>o`
		@media screen and (max-width: ${599}px) {
			${o(e,...t)}
		}
	`,E=(e,...t)=>o`
		@media screen and (max-width: ${959}px) {
			${o(e,...t)}
		}
	`,O=(e,...t)=>o`
		@media screen and (max-width: ${1280}px) {
			${o(e,...t)}
		}
	`,P=e=>(t,...n)=>o`
				@media screen and (max-width: ${e}px) {
					${o(t,...n)}
				}
			`,k=n.div`
	position: relative;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	line-height: normal;
	${({theme:e,headCell:t})=>e[t?"headCells":"cells"].style};
	${({noPadding:e})=>e&&"padding: 0"};
`,D=n(k)`
	flex-grow: ${({button:e,grow:t})=>0===t||e?0:t||1};
	flex-shrink: 0;
	flex-basis: 0;
	max-width: ${({maxWidth:e})=>e||"100%"};
	min-width: ${({minWidth:e})=>e||"100px"};
	${({width:e})=>e&&o`
			min-width: ${e};
			max-width: ${e};
		`};
	${({right:e})=>e&&"justify-content: flex-end"};
	${({button:e,center:t})=>(t||e)&&"justify-content: center"};
	${({compact:e,button:t})=>(e||t)&&"padding: 0"};

	/* handle hiding cells */
	${({hide:e})=>e&&"sm"===e&&S`
    display: none;
  `};
	${({hide:e})=>e&&"md"===e&&E`
    display: none;
  `};
	${({hide:e})=>e&&"lg"===e&&O`
    display: none;
  `};
	${({hide:e})=>e&&Number.isInteger(e)&&P(e)`
    display: none;
  `};
`,H=o`
	div:first-child {
		white-space: ${({wrapCell:e})=>e?"normal":"nowrap"};
		overflow: ${({allowOverflow:e})=>e?"visible":"hidden"};
		text-overflow: ellipsis;
	}
`,$=n(D).attrs((e=>({style:e.style})))`
	${({renderAsCell:e})=>!e&&H};
	${({theme:e,isDragging:t})=>t&&e.cells.draggingStyle};
	${({cellStyle:e})=>e};
`;var F=e.memo((function({id:t,column:n,row:o,rowIndex:a,dataTag:l,isDragging:r,onDragStart:s,onDragOver:d,onDragEnd:c,onDragEnter:g,onDragLeave:p}){const{style:u,classNames:m}=b(o,n.conditionalCellStyles,["rdt_TableCell"]);return e.createElement($,{id:t,"data-column-id":n.id,role:"gridcell",className:m,"data-tag":l,cellStyle:n.style,renderAsCell:!!n.cell,allowOverflow:n.allowOverflow,button:n.button,center:n.center,compact:n.compact,grow:n.grow,hide:n.hide,maxWidth:n.maxWidth,minWidth:n.minWidth,right:n.right,width:n.width,wrapCell:n.wrap,style:u,isDragging:r,onDragStart:s,onDragOver:d,onDragEnd:c,onDragEnter:g,onDragLeave:p},!n.cell&&e.createElement("div",{"data-tag":l},function(e,t,n,o){if(!t)return null;if("string"!=typeof t&&"function"!=typeof t)throw new Error("selector must be a . delimited string eg (my.property) or function (e.g. row => row.field");return n&&"function"==typeof n?n(e,o):t&&"function"==typeof t?t(e,o):i(e,t)}(o,n.selector,n.format,a)),n.cell&&n.cell(o,a,n,t))}));var j=e.memo((function({name:t,component:n="input",componentOptions:o={style:{}},indeterminate:a=!1,checked:l=!1,disabled:r=!1,onClick:i=u}){const s=n,d="input"!==s?o.style:(e=>Object.assign(Object.assign({fontSize:"18px"},!e&&{cursor:"pointer"}),{padding:0,marginTop:"1px",verticalAlign:"middle",position:"relative"}))(r),c=e.useMemo((()=>function(e,...t){let n;return Object.keys(e).map((t=>e[t])).forEach(((o,a)=>{const l=e;"function"==typeof o&&(n=Object.assign(Object.assign({},l),{[Object.keys(e)[a]]:o(...t)}))})),n||e}(o,a)),[o,a]);return e.createElement(s,Object.assign({type:"checkbox",ref:e=>{e&&(e.indeterminate=a)},style:d,onClick:r?u:i,name:t,"aria-label":t,checked:l,disabled:r},c,{onChange:u}))}));const I=n(k)`
	flex: 0 0 48px;
	min-width: 48px;
	justify-content: center;
	align-items: center;
	user-select: none;
	white-space: nowrap;
`;function T({name:t,keyField:n,row:o,rowCount:a,selected:l,selectableRowsComponent:r,selectableRowsComponentProps:i,selectableRowsSingle:s,selectableRowDisabled:d,onSelectedRow:c}){const g=!(!d||!d(o));return e.createElement(I,{onClick:e=>e.stopPropagation(),className:"rdt_TableCell",noPadding:!0},e.createElement(j,{name:t,component:r,componentOptions:i,checked:l,"aria-checked":l,onClick:()=>{c({type:"SELECT_SINGLE_ROW",row:o,isSelected:l,keyField:n,rowCount:a,singleSelect:s})},disabled:g}))}const A=n.button`
	display: inline-flex;
	align-items: center;
	user-select: none;
	white-space: nowrap;
	border: none;
	background-color: transparent;
	${({theme:e})=>e.expanderButton.style};
`;function L({disabled:t=!1,expanded:n=!1,expandableIcon:o,id:a,row:l,onToggled:r}){const i=n?o.expanded:o.collapsed;return e.createElement(A,{"aria-disabled":t,onClick:()=>r&&r(l),"data-testid":`expander-button-${a}`,disabled:t,"aria-label":n?"Collapse Row":"Expand Row",role:"button",type:"button"},i)}const _=n(k)`
	white-space: nowrap;
	font-weight: 400;
	min-width: 48px;
	${({theme:e})=>e.expanderCell.style};
`;function M({row:t,expanded:n=!1,expandableIcon:o,id:a,onToggled:l,disabled:r=!1}){return e.createElement(_,{onClick:e=>e.stopPropagation(),noPadding:!0},e.createElement(L,{id:a,row:t,expanded:n,expandableIcon:o,disabled:r,onToggled:l}))}const N=n.div`
	width: 100%;
	box-sizing: border-box;
	${({theme:e})=>e.expanderRow.style};
	${({extendedRowStyle:e})=>e};
`;var z=e.memo((function({data:t,ExpanderComponent:n,expanderComponentProps:o,extendedRowStyle:a,extendedClassNames:l}){const r=["rdt_ExpanderRow",...l.split(" ").filter((e=>"rdt_TableRow"!==e))].join(" ");return e.createElement(N,{className:r,extendedRowStyle:a},e.createElement(n,Object.assign({data:t},o)))}));const W="allowRowEvents";var B,G,V;!function(e){e.LTR="ltr",e.RTL="rtl",e.AUTO="auto"}(B||(B={})),function(e){e.LEFT="left",e.RIGHT="right",e.CENTER="center"}(G||(G={})),function(e){e.SM="sm",e.MD="md",e.LG="lg"}(V||(V={}));const U=o`
	&:hover {
		${({highlightOnHover:e,theme:t})=>e&&t.rows.highlightOnHoverStyle};
	}
`,Y=o`
	&:hover {
		cursor: pointer;
	}
`,K=n.div.attrs((e=>({style:e.style})))`
	display: flex;
	align-items: stretch;
	align-content: stretch;
	width: 100%;
	box-sizing: border-box;
	${({theme:e})=>e.rows.style};
	${({dense:e,theme:t})=>e&&t.rows.denseStyle};
	${({striped:e,theme:t})=>e&&t.rows.stripedStyle};
	${({highlightOnHover:e})=>e&&U};
	${({pointerOnHover:e})=>e&&Y};
	${({selected:e,theme:t})=>e&&t.rows.selectedHighlightStyle};
`;function q({columns:t=[],conditionalRowStyles:n=[],defaultExpanded:o=!1,defaultExpanderDisabled:a=!1,dense:l=!1,expandableIcon:i,expandableRows:s=!1,expandableRowsComponent:d,expandableRowsComponentProps:c,expandableRowsHideExpander:g,expandOnRowClicked:p=!1,expandOnRowDoubleClicked:m=!1,highlightOnHover:h=!1,id:f,expandableInheritConditionalStyles:x,keyField:C,onRowClicked:y=u,onRowDoubleClicked:v=u,onRowExpandToggled:R=u,onSelectedRow:S=u,pointerOnHover:E=!1,row:O,rowCount:P,rowIndex:k,selectableRowDisabled:D=null,selectableRows:H=!1,selectableRowsComponent:$,selectableRowsComponentProps:j,selectableRowsHighlight:I=!1,selectableRowsSingle:A=!1,selected:L,striped:_=!1,draggingColumnId:N,onDragStart:W,onDragOver:B,onDragEnd:G,onDragEnter:V,onDragLeave:U}){const[Y,q]=e.useState(o);e.useEffect((()=>{q(o)}),[o]);const J=e.useCallback((()=>{q(!Y),R(!Y,O)}),[Y,R,O]),Q=E||s&&(p||m),X=e.useCallback((e=>{e.target&&"allowRowEvents"===e.target.getAttribute("data-tag")&&(y(O,e),!a&&s&&p&&J())}),[a,p,s,J,y,O]),Z=e.useCallback((e=>{e.target&&"allowRowEvents"===e.target.getAttribute("data-tag")&&(v(O,e),!a&&s&&m&&J())}),[a,m,s,J,v,O]),ee=r(O,C),{style:te,classNames:ne}=b(O,n,["rdt_TableRow"]),oe=I&&L,ae=x?te:{},le=_&&k%2==0;return e.createElement(e.Fragment,null,e.createElement(K,{id:`row-${f}`,role:"row",striped:le,highlightOnHover:h,pointerOnHover:!a&&Q,dense:l,onClick:X,onDoubleClick:Z,className:ne,selected:oe,style:te},H&&e.createElement(T,{name:`select-row-${ee}`,keyField:C,row:O,rowCount:P,selected:L,selectableRowsComponent:$,selectableRowsComponentProps:j,selectableRowDisabled:D,selectableRowsSingle:A,onSelectedRow:S}),s&&!g&&e.createElement(M,{id:ee,expandableIcon:i,expanded:Y,row:O,onToggled:J,disabled:a}),t.map((t=>t.omit?null:e.createElement(F,{id:`cell-${t.id}-${ee}`,key:`cell-${t.id}-${ee}`,dataTag:t.ignoreRowClick||t.button?null:"allowRowEvents",column:t,row:O,rowIndex:k,isDragging:w(N,t.id),onDragStart:W,onDragOver:B,onDragEnd:G,onDragEnter:V,onDragLeave:U})))),s&&Y&&e.createElement(z,{key:`expander-${ee}`,data:O,extendedRowStyle:ae,extendedClassNames:ne,ExpanderComponent:d,expanderComponentProps:c}))}const J=n.span`
	padding: 2px;
	color: inherit;
	flex-grow: 0;
	flex-shrink: 0;
	${({sortActive:e})=>e?"opacity: 1":"opacity: 0"};
	${({sortDirection:e})=>"desc"===e&&"transform: rotate(180deg)"};
`,Q=({sortActive:e,sortDirection:n})=>t.createElement(J,{sortActive:e,sortDirection:n},"▲"),X=n(D)`
	${({button:e})=>e&&"text-align: center"};
	${({theme:e,isDragging:t})=>t&&e.headCells.draggingStyle};
`,Z=o`
	cursor: pointer;
	span.__rdt_custom_sort_icon__ {
		i,
		svg {
			transform: 'translate3d(0, 0, 0)';
			${({sortActive:e})=>e?"opacity: 1":"opacity: 0"};
			color: inherit;
			font-size: 18px;
			height: 18px;
			width: 18px;
			backface-visibility: hidden;
			transform-style: preserve-3d;
			transition-duration: 95ms;
			transition-property: transform;
		}

		&.asc i,
		&.asc svg {
			transform: rotate(180deg);
		}
	}

	${({sortActive:e})=>!e&&o`
			&:hover,
			&:focus {
				opacity: 0.7;

				span,
				span.__rdt_custom_sort_icon__ * {
					opacity: 0.7;
				}
			}
		`};
`,ee=n.div`
	display: inline-flex;
	align-items: center;
	justify-content: inherit;
	height: 100%;
	width: 100%;
	outline: none;
	user-select: none;
	overflow: hidden;
	${({disabled:e})=>!e&&Z};
`,te=n.div`
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;var ne=e.memo((function({column:t,disabled:n,draggingColumnId:o,selectedColumn:a={},sortDirection:r,sortIcon:i,sortServer:s,pagination:d,paginationServer:c,persistSelectedOnSort:g,selectableRowsVisibleOnly:p,onSort:u,onDragStart:b,onDragOver:m,onDragEnd:h,onDragEnter:f,onDragLeave:x}){e.useEffect((()=>{"string"==typeof t.selector&&console.error(`Warning: ${t.selector} is a string based column selector which has been deprecated as of v7 and will be removed in v8. Instead, use a selector function e.g. row => row[field]...`)}),[]);const[C,y]=e.useState(!1),v=e.useRef(null);if(e.useEffect((()=>{v.current&&y(v.current.scrollWidth>v.current.clientWidth)}),[C]),t.omit)return null;const R=()=>{if(!t.sortable&&!t.selector)return;let e=r;w(a.id,t.id)&&(e=r===l.ASC?l.DESC:l.ASC),u({type:"SORT_CHANGE",sortDirection:e,selectedColumn:t,clearSelectedOnSort:d&&c&&!g||s||p})},S=t=>e.createElement(Q,{sortActive:t,sortDirection:r}),E=()=>e.createElement("span",{className:[r,"__rdt_custom_sort_icon__"].join(" ")},i),O=!(!t.sortable||!w(a.id,t.id)),P=!t.sortable||n,k=t.sortable&&!i&&!t.right,D=t.sortable&&!i&&t.right,H=t.sortable&&i&&!t.right,$=t.sortable&&i&&t.right;return e.createElement(X,{"data-column-id":t.id,className:"rdt_TableCol",headCell:!0,allowOverflow:t.allowOverflow,button:t.button,compact:t.compact,grow:t.grow,hide:t.hide,maxWidth:t.maxWidth,minWidth:t.minWidth,right:t.right,center:t.center,width:t.width,draggable:t.reorder,isDragging:w(t.id,o),onDragStart:b,onDragOver:m,onDragEnd:h,onDragEnter:f,onDragLeave:x},t.name&&e.createElement(ee,{"data-column-id":t.id,"data-sort-id":t.id,role:"columnheader",tabIndex:0,className:"rdt_TableCol_Sortable",onClick:P?void 0:R,onKeyPress:P?void 0:e=>{"Enter"===e.key&&R()},sortActive:!P&&O,disabled:P},!P&&$&&E(),!P&&D&&S(O),"string"==typeof t.name?e.createElement(te,{title:C?t.name:void 0,ref:v,"data-column-id":t.id},t.name):t.name,!P&&H&&E(),!P&&k&&S(O)))}));const oe=n(k)`
	flex: 0 0 48px;
	justify-content: center;
	align-items: center;
	user-select: none;
	white-space: nowrap;
	font-size: unset;
`;function ae({headCell:t=!0,rowData:n,keyField:o,allSelected:a,mergeSelections:l,selectedRows:r,selectableRowsComponent:i,selectableRowsComponentProps:s,selectableRowDisabled:d,onSelectAllRows:c}){const g=r.length>0&&!a,p=d?n.filter((e=>!d(e))):n,u=0===p.length,b=Math.min(n.length,p.length);return e.createElement(oe,{className:"rdt_TableCol",headCell:t,noPadding:!0},e.createElement(j,{name:"select-all-rows",component:i,componentOptions:s,onClick:()=>{c({type:"SELECT_ALL_ROWS",rows:p,rowCount:b,mergeSelections:l,keyField:o})},checked:a,indeterminate:g,disabled:u}))}function le(t=B.AUTO){const n="object"==typeof window,[o,a]=e.useState(!1);return e.useEffect((()=>{if(n)if("auto"!==t)a("rtl"===t);else{const e=!(!window.document||!window.document.createElement),t=document.getElementsByTagName("BODY")[0],n=document.getElementsByTagName("HTML")[0],o="rtl"===t.dir||"rtl"===n.dir;a(e&&o)}}),[t,n]),o}const re=n.div`
	display: flex;
	align-items: center;
	flex: 1 0 auto;
	height: 100%;
	color: ${({theme:e})=>e.contextMenu.fontColor};
	font-size: ${({theme:e})=>e.contextMenu.fontSize};
	font-weight: 400;
`,ie=n.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	flex-wrap: wrap;
`,se=n.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	box-sizing: inherit;
	z-index: 1;
	align-items: center;
	justify-content: space-between;
	display: flex;
	${({rtl:e})=>e&&"direction: rtl"};
	${({theme:e})=>e.contextMenu.style};
	${({theme:e,visible:t})=>t&&e.contextMenu.activeStyle};
`;function de({contextMessage:t,contextActions:n,contextComponent:o,selectedCount:a,direction:l}){const r=le(l),i=a>0;return o?e.createElement(se,{visible:i},e.cloneElement(o,{selectedCount:a})):e.createElement(se,{visible:i,rtl:r},e.createElement(re,null,((e,t,n)=>{if(0===t)return null;const o=1===t?e.singular:e.plural;return n?`${t} ${e.message||""} ${o}`:`${t} ${o} ${e.message||""}`})(t,a,r)),e.createElement(ie,null,n))}const ce=n.div`
	position: relative;
	box-sizing: border-box;
	overflow: hidden;
	display: flex;
	flex: 1 1 auto;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	flex-wrap: wrap;
	${({theme:e})=>e.header.style}
`,ge=n.div`
	flex: 1 0 auto;
	color: ${({theme:e})=>e.header.fontColor};
	font-size: ${({theme:e})=>e.header.fontSize};
	font-weight: 400;
`,pe=n.div`
	flex: 1 0 auto;
	display: flex;
	align-items: center;
	justify-content: flex-end;

	> * {
		margin-left: 5px;
	}
`,ue=({title:t,actions:n=null,contextMessage:o,contextActions:a,contextComponent:l,selectedCount:r,direction:i,showMenu:s=!0})=>e.createElement(ce,{className:"rdt_TableHeader",role:"heading","aria-level":1},e.createElement(ge,null,t),n&&e.createElement(pe,null,n),s&&e.createElement(de,{contextMessage:o,contextActions:a,contextComponent:l,direction:i,selectedCount:r}))
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */;function be(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var a=0;for(o=Object.getOwnPropertySymbols(e);a<o.length;a++)t.indexOf(o[a])<0&&Object.prototype.propertyIsEnumerable.call(e,o[a])&&(n[o[a]]=e[o[a]])}return n}const me={left:"flex-start",right:"flex-end",center:"center"},he=n.header`
	position: relative;
	display: flex;
	flex: 1 1 auto;
	box-sizing: border-box;
	align-items: center;
	padding: 4px 16px 4px 24px;
	width: 100%;
	justify-content: ${({align:e})=>me[e]};
	flex-wrap: ${({wrapContent:e})=>e?"wrap":"nowrap"};
	${({theme:e})=>e.subHeader.style}
`,we=t=>{var{align:n="right",wrapContent:o=!0}=t,a=be(t,["align","wrapContent"]);return e.createElement(he,Object.assign({align:n,wrapContent:o},a))},fe=n.div`
	display: flex;
	flex-direction: column;
`,xe=n.div`
	position: relative;
	width: 100%;
	border-radius: inherit;
	${({responsive:e,fixedHeader:t})=>e&&o`
			overflow-x: auto;

			// hidden prevents vertical scrolling in firefox when fixedHeader is disabled
			overflow-y: ${t?"auto":"hidden"};
			min-height: 0;
		`};

	${({fixedHeader:e=!1,fixedHeaderScrollHeight:t="100vh"})=>e&&o`
			max-height: ${t};
			-webkit-overflow-scrolling: touch;
		`};
`,Ce=n.div`
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	${e=>e.theme.progress.style};
`,ye=n.div`
	position: relative;
	width: 100%;
	${({theme:e})=>e.tableWrapper.style};
`,ve=n(k)`
	white-space: nowrap;
	${({theme:e})=>e.expanderCell.style};
`,Re=n.div`
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	${({theme:e})=>e.noData.style};
`,Se=()=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},t.createElement("path",{d:"M7 10l5 5 5-5z"}),t.createElement("path",{d:"M0 0h24v24H0z",fill:"none"})),Ee=n.select`
	cursor: pointer;
	height: 24px;
	max-width: 100%;
	user-select: none;
	padding-left: 8px;
	padding-right: 24px;
	box-sizing: content-box;
	font-size: inherit;
	color: inherit;
	border: none;
	background-color: transparent;
	appearance: none;
	direction: ltr;
	flex-shrink: 0;

	&::-ms-expand {
		display: none;
	}

	&:disabled::-ms-expand {
		background: #f60;
	}

	option {
		color: initial;
	}
`,Oe=n.div`
	position: relative;
	flex-shrink: 0;
	font-size: inherit;
	color: inherit;
	margin-top: 1px;

	svg {
		top: 0;
		right: 0;
		color: inherit;
		position: absolute;
		fill: currentColor;
		width: 24px;
		height: 24px;
		display: inline-block;
		user-select: none;
		pointer-events: none;
	}
`,Pe=t=>{var{defaultValue:n,onChange:o}=t,a=be(t,["defaultValue","onChange"]);return e.createElement(Oe,null,e.createElement(Ee,Object.assign({onChange:o,defaultValue:n},a)),e.createElement(Se,null))},ke={columns:[],data:[],title:"",keyField:"id",selectableRows:!1,selectableRowsHighlight:!1,selectableRowsNoSelectAll:!1,selectableRowSelected:null,selectableRowDisabled:null,selectableRowsComponent:"input",selectableRowsComponentProps:{},selectableRowsVisibleOnly:!1,selectableRowsSingle:!1,clearSelectedRows:!1,expandableRows:!1,expandableRowDisabled:null,expandableRowExpanded:null,expandOnRowClicked:!1,expandableRowsHideExpander:!1,expandOnRowDoubleClicked:!1,expandableInheritConditionalStyles:!1,expandableRowsComponent:function(){return t.createElement("div",null,"To add an expander pass in a component instance via ",t.createElement("strong",null,"expandableRowsComponent"),". You can then access props.data from this component.")},expandableIcon:{collapsed:t.createElement((()=>t.createElement("svg",{fill:"currentColor",height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"},t.createElement("path",{d:"M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"}),t.createElement("path",{d:"M0-.25h24v24H0z",fill:"none"}))),null),expanded:t.createElement((()=>t.createElement("svg",{fill:"currentColor",height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"},t.createElement("path",{d:"M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"}),t.createElement("path",{d:"M0-.75h24v24H0z",fill:"none"}))),null)},expandableRowsComponentProps:{},progressPending:!1,progressComponent:t.createElement("div",{style:{fontSize:"24px",fontWeight:700,padding:"24px"}},"Loading..."),persistTableHead:!1,sortIcon:null,sortFunction:null,sortServer:!1,striped:!1,highlightOnHover:!1,pointerOnHover:!1,noContextMenu:!1,contextMessage:{singular:"item",plural:"items",message:"selected"},actions:null,contextActions:null,contextComponent:null,defaultSortFieldId:null,defaultSortAsc:!0,responsive:!0,noDataComponent:t.createElement("div",{style:{padding:"24px"}},"There are no records to display"),disabled:!1,noTableHead:!1,noHeader:!1,subHeader:!1,subHeaderAlign:G.RIGHT,subHeaderWrap:!0,subHeaderComponent:null,subHeading:null,fixedHeader:!1,fixedHeaderScrollHeight:"100vh",pagination:!1,paginationServer:!1,paginationServerOptions:{persistSelectedOnSort:!1,persistSelectedOnPageChange:!1},paginationDefaultPage:1,paginationResetDefaultPage:!1,paginationTotalRows:0,paginationPerPage:10,paginationRowsPerPageOptions:[10,15,20,25,30],paginationComponent:null,paginationComponentOptions:{},paginationIconFirstPage:t.createElement((()=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},t.createElement("path",{d:"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"}),t.createElement("path",{fill:"none",d:"M24 24H0V0h24v24z"}))),null),paginationIconLastPage:t.createElement((()=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},t.createElement("path",{d:"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"}),t.createElement("path",{fill:"none",d:"M0 0h24v24H0V0z"}))),null),paginationIconNext:t.createElement((()=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},t.createElement("path",{d:"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"}),t.createElement("path",{d:"M0 0h24v24H0z",fill:"none"}))),null),paginationIconPrevious:t.createElement((()=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},t.createElement("path",{d:"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"}),t.createElement("path",{d:"M0 0h24v24H0z",fill:"none"}))),null),dense:!1,conditionalRowStyles:[],theme:"default",customStyles:{},direction:B.AUTO,onChangePage:u,onChangeRowsPerPage:u,onRowClicked:u,onRowDoubleClicked:u,onRowExpandToggled:u,onSelectedRowsChange:u,onSort:u,onColumnOrderChange:u},De={rowsPerPageText:"Rows per page:",rangeSeparatorText:"of",noRowsPerPage:!1,selectAllRowsItem:!1,selectAllRowsItemText:"All"},He=n.nav`
	display: flex;
	flex: 1 1 auto;
	justify-content: flex-end;
	align-items: center;
	box-sizing: border-box;
	padding-right: 8px;
	padding-left: 8px;
	width: 100%;
	${({theme:e})=>e.pagination.style};
`,$e=n.button`
	position: relative;
	display: block;
	user-select: none;
	border: none;
	${({theme:e})=>e.pagination.pageButtonsStyle};
	${({isRTL:e})=>e&&"transform: scale(-1, -1)"};
`,Fe=n.div`
	display: flex;
	align-items: center;
	border-radius: 4px;
	white-space: nowrap;
	${S`
    width: 100%;
    justify-content: space-around;
  `};
`,je=n.span`
	flex-shrink: 1;
	user-select: none;
`,Ie=n(je)`
	margin: 0 24px;
`,Te=n(je)`
	margin: 0 4px;
`;var Ae=e.memo((function({rowsPerPage:t,rowCount:n,currentPage:o,direction:a=ke.direction,paginationRowsPerPageOptions:l=ke.paginationRowsPerPageOptions,paginationIconLastPage:r=ke.paginationIconLastPage,paginationIconFirstPage:i=ke.paginationIconFirstPage,paginationIconNext:s=ke.paginationIconNext,paginationIconPrevious:d=ke.paginationIconPrevious,paginationComponentOptions:c=ke.paginationComponentOptions,onChangeRowsPerPage:p=ke.onChangeRowsPerPage,onChangePage:u=ke.onChangePage}){const b=(()=>{const t="object"==typeof window;function n(){return{width:t?window.innerWidth:void 0,height:t?window.innerHeight:void 0}}const[o,a]=e.useState(n);return e.useEffect((()=>{if(!t)return()=>null;function e(){a(n())}return window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)}),[]),o})(),m=le(a),h=b.width&&b.width>599,w=g(n,t),f=o*t,x=f-t+1,C=1===o,y=o===w,v=Object.assign(Object.assign({},De),c),R=o===w?`${x}-${n} ${v.rangeSeparatorText} ${n}`:`${x}-${f} ${v.rangeSeparatorText} ${n}`,S=e.useCallback((()=>u(o-1)),[o,u]),E=e.useCallback((()=>u(o+1)),[o,u]),O=e.useCallback((()=>u(1)),[u]),P=e.useCallback((()=>u(g(n,t))),[u,n,t]),k=e.useCallback((e=>p(Number(e.target.value),o)),[o,p]),D=l.map((t=>e.createElement("option",{key:t,value:t},t)));v.selectAllRowsItem&&D.push(e.createElement("option",{key:-1,value:n},v.selectAllRowsItemText));const H=e.createElement(Pe,{onChange:k,defaultValue:t,"aria-label":v.rowsPerPageText},D);return e.createElement(He,{className:"rdt_Pagination"},!v.noRowsPerPage&&h&&e.createElement(e.Fragment,null,e.createElement(Te,null,v.rowsPerPageText),H),h&&e.createElement(Ie,null,R),e.createElement(Fe,null,e.createElement($e,{id:"pagination-first-page",type:"button","aria-label":"First Page","aria-disabled":C,onClick:O,disabled:C,isRTL:m},i),e.createElement($e,{id:"pagination-previous-page",type:"button","aria-label":"Previous Page","aria-disabled":C,onClick:S,disabled:C,isRTL:m},d),!h&&H,e.createElement($e,{id:"pagination-next-page",type:"button","aria-label":"Next Page","aria-disabled":y,onClick:E,disabled:y,isRTL:m},s),e.createElement($e,{id:"pagination-last-page",type:"button","aria-label":"Last Page","aria-disabled":y,onClick:P,disabled:y,isRTL:m},r)))}));const Le=(t,n)=>{const o=e.useRef(!0);e.useEffect((()=>{o.current?o.current=!1:t()}),n)};var _e=function(e){return function(e){return!!e&&"object"==typeof e}(e)&&!function(e){var t=Object.prototype.toString.call(e);return"[object RegExp]"===t||"[object Date]"===t||function(e){return e.$$typeof===Me}(e)}(e)};var Me="function"==typeof Symbol&&Symbol.for?Symbol.for("react.element"):60103;function Ne(e,t){return!1!==t.clone&&t.isMergeableObject(e)?Ve((n=e,Array.isArray(n)?[]:{}),e,t):e;var n}function ze(e,t,n){return e.concat(t).map((function(e){return Ne(e,n)}))}function We(e){return Object.keys(e).concat(function(e){return Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e).filter((function(t){return e.propertyIsEnumerable(t)})):[]}(e))}function Be(e,t){try{return t in e}catch(e){return!1}}function Ge(e,t,n){var o={};return n.isMergeableObject(e)&&We(e).forEach((function(t){o[t]=Ne(e[t],n)})),We(t).forEach((function(a){(function(e,t){return Be(e,t)&&!(Object.hasOwnProperty.call(e,t)&&Object.propertyIsEnumerable.call(e,t))})(e,a)||(Be(e,a)&&n.isMergeableObject(t[a])?o[a]=function(e,t){if(!t.customMerge)return Ve;var n=t.customMerge(e);return"function"==typeof n?n:Ve}(a,n)(e[a],t[a],n):o[a]=Ne(t[a],n))})),o}function Ve(e,t,n){(n=n||{}).arrayMerge=n.arrayMerge||ze,n.isMergeableObject=n.isMergeableObject||_e,n.cloneUnlessOtherwiseSpecified=Ne;var o=Array.isArray(t);return o===Array.isArray(e)?o?n.arrayMerge(e,t,n):Ge(e,t,n):Ne(t,n)}Ve.all=function(e,t){if(!Array.isArray(e))throw new Error("first argument should be an array");return e.reduce((function(e,n){return Ve(e,n,t)}),{})};var Ue=Ve;const Ye={text:{primary:"rgba(0, 0, 0, 0.87)",secondary:"rgba(0, 0, 0, 0.54)",disabled:"rgba(0, 0, 0, 0.38)"},background:{default:"#FFFFFF"},context:{background:"#e3f2fd",text:"rgba(0, 0, 0, 0.87)"},divider:{default:"rgba(0,0,0,.12)"},button:{default:"rgba(0,0,0,.54)",focus:"rgba(0,0,0,.12)",hover:"rgba(0,0,0,.12)",disabled:"rgba(0, 0, 0, .18)"},selected:{default:"#e3f2fd",text:"rgba(0, 0, 0, 0.87)"},highlightOnHover:{default:"#EEEEEE",text:"rgba(0, 0, 0, 0.87)"},striped:{default:"#FAFAFA",text:"rgba(0, 0, 0, 0.87)"}},Ke={default:Ye,light:Ye,dark:{text:{primary:"#FFFFFF",secondary:"rgba(255, 255, 255, 0.7)",disabled:"rgba(0,0,0,.12)"},background:{default:"#424242"},context:{background:"#E91E63",text:"#FFFFFF"},divider:{default:"rgba(81, 81, 81, 1)"},button:{default:"#FFFFFF",focus:"rgba(255, 255, 255, .54)",hover:"rgba(255, 255, 255, .12)",disabled:"rgba(255, 255, 255, .18)"},selected:{default:"rgba(0, 0, 0, .7)",text:"#FFFFFF"},highlightOnHover:{default:"rgba(0, 0, 0, .7)",text:"#FFFFFF"},striped:{default:"rgba(0, 0, 0, .87)",text:"#FFFFFF"}}};function qe(e="default",t,n="default"){return Ke[e]||(Ke[e]=Ue(Ke[n],t||{})),Ke[e]=Ue(Ke[e],t||{}),Ke[e]}function Je(t,n,o,a){const[r,i]=e.useState((()=>c(t))),[s,d]=e.useState(""),g=e.useRef("");Le((()=>{i(c(t))}),[t]);const p=e.useCallback((e=>{var t,n,o;const{attributes:a}=e.target,l=null===(t=a.getNamedItem("data-column-id"))||void 0===t?void 0:t.value;l&&(g.current=(null===(o=null===(n=r[h(r,l)])||void 0===n?void 0:n.id)||void 0===o?void 0:o.toString())||"",d(g.current))}),[r]),u=e.useCallback((e=>{var t;const{attributes:o}=e.target,a=null===(t=o.getNamedItem("data-column-id"))||void 0===t?void 0:t.value;if(a&&g.current&&a!==g.current){const e=h(r,g.current),t=h(r,a),o=[...r];o[e]=r[t],o[t]=r[e],i(o),n(o)}}),[n,r]),b=e.useCallback((e=>{e.preventDefault()}),[]),m=e.useCallback((e=>{e.preventDefault()}),[]),w=e.useCallback((e=>{e.preventDefault(),g.current="",d("")}),[]),f=function(e=!1){return e?l.ASC:l.DESC}(a),x=e.useMemo((()=>r[h(r,null==o?void 0:o.toString())]||{}),[o,r]);return{tableColumns:r,draggingColumnId:s,handleDragStart:p,handleDragEnter:u,handleDragOver:b,handleDragLeave:m,handleDragEnd:w,defaultSortDirection:f,defaultSortColumn:x}}var Qe=e.memo((function(t){const{data:n=ke.data,columns:o=ke.columns,title:s=ke.title,actions:d=ke.actions,keyField:c=ke.keyField,striped:u=ke.striped,highlightOnHover:b=ke.highlightOnHover,pointerOnHover:h=ke.pointerOnHover,dense:w=ke.dense,selectableRows:x=ke.selectableRows,selectableRowsSingle:y=ke.selectableRowsSingle,selectableRowsHighlight:S=ke.selectableRowsHighlight,selectableRowsNoSelectAll:E=ke.selectableRowsNoSelectAll,selectableRowsVisibleOnly:O=ke.selectableRowsVisibleOnly,selectableRowSelected:P=ke.selectableRowSelected,selectableRowDisabled:D=ke.selectableRowDisabled,selectableRowsComponent:H=ke.selectableRowsComponent,selectableRowsComponentProps:$=ke.selectableRowsComponentProps,onRowExpandToggled:F=ke.onRowExpandToggled,onSelectedRowsChange:j=ke.onSelectedRowsChange,expandableIcon:I=ke.expandableIcon,onChangeRowsPerPage:T=ke.onChangeRowsPerPage,onChangePage:A=ke.onChangePage,paginationServer:L=ke.paginationServer,paginationServerOptions:_=ke.paginationServerOptions,paginationTotalRows:M=ke.paginationTotalRows,paginationDefaultPage:N=ke.paginationDefaultPage,paginationResetDefaultPage:z=ke.paginationResetDefaultPage,paginationPerPage:W=ke.paginationPerPage,paginationRowsPerPageOptions:B=ke.paginationRowsPerPageOptions,paginationIconLastPage:G=ke.paginationIconLastPage,paginationIconFirstPage:V=ke.paginationIconFirstPage,paginationIconNext:U=ke.paginationIconNext,paginationIconPrevious:Y=ke.paginationIconPrevious,paginationComponent:K=ke.paginationComponent,paginationComponentOptions:J=ke.paginationComponentOptions,responsive:Q=ke.responsive,progressPending:X=ke.progressPending,progressComponent:Z=ke.progressComponent,persistTableHead:ee=ke.persistTableHead,noDataComponent:te=ke.noDataComponent,disabled:oe=ke.disabled,noTableHead:le=ke.noTableHead,noHeader:re=ke.noHeader,fixedHeader:ie=ke.fixedHeader,fixedHeaderScrollHeight:se=ke.fixedHeaderScrollHeight,pagination:de=ke.pagination,subHeader:ce=ke.subHeader,subHeaderAlign:ge=ke.subHeaderAlign,subHeaderWrap:pe=ke.subHeaderWrap,subHeaderComponent:be=ke.subHeaderComponent,subHeading:me=ke.subHeading,noContextMenu:he=ke.noContextMenu,contextMessage:Se=ke.contextMessage,contextActions:Ee=ke.contextActions,contextComponent:Oe=ke.contextComponent,expandableRows:Pe=ke.expandableRows,onRowClicked:De=ke.onRowClicked,onRowDoubleClicked:He=ke.onRowDoubleClicked,sortIcon:$e=ke.sortIcon,onSort:Fe=ke.onSort,sortFunction:je=ke.sortFunction,sortServer:Ie=ke.sortServer,expandableRowsComponent:Te=ke.expandableRowsComponent,expandableRowsComponentProps:_e=ke.expandableRowsComponentProps,expandableRowDisabled:Me=ke.expandableRowDisabled,expandableRowsHideExpander:Ne=ke.expandableRowsHideExpander,expandOnRowClicked:ze=ke.expandOnRowClicked,expandOnRowDoubleClicked:We=ke.expandOnRowDoubleClicked,expandableRowExpanded:Be=ke.expandableRowExpanded,expandableInheritConditionalStyles:Ge=ke.expandableInheritConditionalStyles,defaultSortFieldId:Ve=ke.defaultSortFieldId,defaultSortAsc:Ye=ke.defaultSortAsc,clearSelectedRows:qe=ke.clearSelectedRows,conditionalRowStyles:Qe=ke.conditionalRowStyles,theme:Xe=ke.theme,customStyles:Ze=ke.customStyles,direction:et=ke.direction,onColumnOrderChange:tt=ke.onColumnOrderChange}=t,{tableColumns:nt,draggingColumnId:ot,handleDragStart:at,handleDragEnter:lt,handleDragOver:rt,handleDragLeave:it,handleDragEnd:st,defaultSortDirection:dt,defaultSortColumn:ct}=Je(o,tt,Ve,Ye),[{rowsPerPage:gt,currentPage:pt,selectedRows:ut,allSelected:bt,selectedCount:mt,selectedColumn:ht,sortDirection:wt,toggleOnSelectedRowsChange:ft},xt]=e.useReducer(f,{allSelected:!1,selectedCount:0,selectedRows:[],selectedColumn:ct,toggleOnSelectedRowsChange:!1,sortDirection:dt,currentPage:N,rowsPerPage:W,selectedRowsFlag:!1,contextMessage:ke.contextMessage}),{persistSelectedOnSort:Ct=!1,persistSelectedOnPageChange:yt=!1}=_,vt=!(!L||!yt&&!Ct),Rt=de&&!X&&n.length>0,St=K||Ae,Et=e.useMemo((()=>((e={},t="default",n="default")=>{const o=Ke[t]?t:n;return Ue({table:{style:{color:(a=Ke[o]).text.primary,backgroundColor:a.background.default}},tableWrapper:{style:{display:"table"}},header:{style:{fontSize:"22px",color:a.text.primary,backgroundColor:a.background.default,minHeight:"56px",paddingLeft:"16px",paddingRight:"8px"}},subHeader:{style:{backgroundColor:a.background.default,minHeight:"52px"}},head:{style:{color:a.text.primary,fontSize:"12px",fontWeight:500}},headRow:{style:{backgroundColor:a.background.default,minHeight:"52px",borderBottomWidth:"1px",borderBottomColor:a.divider.default,borderBottomStyle:"solid"},denseStyle:{minHeight:"32px"}},headCells:{style:{paddingLeft:"16px",paddingRight:"16px"},draggingStyle:{cursor:"move"}},contextMenu:{style:{backgroundColor:a.context.background,fontSize:"18px",fontWeight:400,color:a.context.text,paddingLeft:"16px",paddingRight:"8px",transform:"translate3d(0, -100%, 0)",transitionDuration:"125ms",transitionTimingFunction:"cubic-bezier(0, 0, 0.2, 1)",willChange:"transform"},activeStyle:{transform:"translate3d(0, 0, 0)"}},cells:{style:{paddingLeft:"16px",paddingRight:"16px",wordBreak:"break-word"},draggingStyle:{}},rows:{style:{fontSize:"13px",fontWeight:400,color:a.text.primary,backgroundColor:a.background.default,minHeight:"48px","&:not(:last-of-type)":{borderBottomStyle:"solid",borderBottomWidth:"1px",borderBottomColor:a.divider.default}},denseStyle:{minHeight:"32px"},selectedHighlightStyle:{"&:nth-of-type(n)":{color:a.selected.text,backgroundColor:a.selected.default,borderBottomColor:a.background.default}},highlightOnHoverStyle:{color:a.highlightOnHover.text,backgroundColor:a.highlightOnHover.default,transitionDuration:"0.15s",transitionProperty:"background-color",borderBottomColor:a.background.default,outlineStyle:"solid",outlineWidth:"1px",outlineColor:a.background.default},stripedStyle:{color:a.striped.text,backgroundColor:a.striped.default}},expanderRow:{style:{color:a.text.primary,backgroundColor:a.background.default}},expanderCell:{style:{flex:"0 0 48px"}},expanderButton:{style:{color:a.button.default,fill:a.button.default,backgroundColor:"transparent",borderRadius:"2px",transition:"0.25s",height:"100%",width:"100%","&:hover:enabled":{cursor:"pointer"},"&:disabled":{color:a.button.disabled},"&:hover:not(:disabled)":{cursor:"pointer",backgroundColor:a.button.hover},"&:focus":{outline:"none",backgroundColor:a.button.focus},svg:{margin:"auto"}}},pagination:{style:{color:a.text.secondary,fontSize:"13px",minHeight:"56px",backgroundColor:a.background.default,borderTopStyle:"solid",borderTopWidth:"1px",borderTopColor:a.divider.default},pageButtonsStyle:{borderRadius:"50%",height:"40px",width:"40px",padding:"8px",margin:"px",cursor:"pointer",transition:"0.4s",color:a.button.default,fill:a.button.default,backgroundColor:"transparent","&:disabled":{cursor:"unset",color:a.button.disabled,fill:a.button.disabled},"&:hover:not(:disabled)":{backgroundColor:a.button.hover},"&:focus":{outline:"none",backgroundColor:a.button.focus}}},noData:{style:{display:"flex",alignItems:"center",justifyContent:"center",color:a.text.primary,backgroundColor:a.background.default}},progress:{style:{display:"flex",alignItems:"center",justifyContent:"center",color:a.text.primary,backgroundColor:a.background.default}}},e);var a})(Ze,Xe)),[Ze,Xe]),Ot=e.useMemo((()=>Object.assign({},"auto"!==et&&{dir:et})),[et]),Pt=e.useMemo((()=>{if(Ie)return n;if((null==ht?void 0:ht.sortFunction)&&"function"==typeof ht.sortFunction){const e=ht.sortFunction,t=wt===l.ASC?e:(t,n)=>-1*e(t,n);return[...n].sort(t)}return function(e,t,n,o){return t?o&&"function"==typeof o?o(e.slice(0),t,n):e.slice(0).sort(((e,o)=>{let a,l;if("string"==typeof t?(a=i(e,t),l=i(o,t)):(a=t(e),l=t(o)),"asc"===n){if(a<l)return-1;if(a>l)return 1}if("desc"===n){if(a>l)return-1;if(a<l)return 1}return 0})):e}(n,null==ht?void 0:ht.selector,wt,je)}),[Ie,ht,wt,n,je]),kt=e.useMemo((()=>{if(de&&!L){const e=pt*gt,t=e-gt;return Pt.slice(t,e)}return Pt}),[pt,de,L,gt,Pt]),Dt=e.useCallback((e=>{xt(e)}),[]),Ht=e.useCallback((e=>{xt(e)}),[]),$t=e.useCallback((e=>{xt(e)}),[]),Ft=e.useCallback(((e,t)=>De(e,t)),[De]),jt=e.useCallback(((e,t)=>He(e,t)),[He]),It=e.useCallback((e=>xt({type:"CHANGE_PAGE",page:e,paginationServer:L,visibleOnly:O,persistSelectedOnPageChange:yt})),[L,yt,O]),Tt=e.useCallback((e=>{const t=g(M||kt.length,e),n=p(pt,t);L||It(n),xt({type:"CHANGE_ROWS_PER_PAGE",page:n,rowsPerPage:e})}),[pt,It,L,M,kt.length]);if(de&&!L&&Pt.length>0&&0===kt.length){const e=g(Pt.length,gt),t=p(pt,e);It(t)}Le((()=>{j({allSelected:bt,selectedCount:mt,selectedRows:ut})}),[ft]),Le((()=>{Fe(ht,wt)}),[ht,wt]),Le((()=>{A(pt,M||Pt.length)}),[pt]),Le((()=>{T(gt,pt)}),[gt]),Le((()=>{It(N)}),[N,z]),Le((()=>{if(de&&L&&M>0){const e=g(M,gt),t=p(pt,e);pt!==t&&It(t)}}),[M]),e.useEffect((()=>{xt({type:"CLEAR_SELECTED_ROWS",selectedRowsFlag:qe})}),[y,qe]),e.useEffect((()=>{if(!P)return;const e=Pt.filter((e=>P(e))),t=y?e.slice(0,1):e;xt({type:"SELECT_MULTIPLE_ROWS",keyField:c,selectedRows:t,totalRows:Pt.length,mergeSelections:vt})}),[n,P]);const At=O?kt:Pt,Lt=yt||y||E;return e.createElement(a,{theme:Et},!re&&(!!s||!!d)&&e.createElement(ue,{title:s,actions:d,showMenu:!he,selectedCount:mt,direction:et,contextActions:Ee,contextComponent:Oe,contextMessage:Se}),ce&&e.createElement(we,{align:ge,wrapContent:pe},be),e.createElement(xe,Object.assign({responsive:Q,fixedHeader:ie,fixedHeaderScrollHeight:se},Ot),e.createElement(ye,null,X&&!ee&&e.createElement(Ce,null,Z),e.createElement(C,{disabled:oe,className:"rdt_Table",role:"table"},!le&&(!!ee||Pt.length>0&&!X)&&e.createElement(v,{className:"rdt_TableHead",role:"rowgroup",fixedHeader:ie},e.createElement(R,{className:"rdt_TableHeadRow",role:"row",dense:w},x&&(Lt?e.createElement(k,{style:{flex:"0 0 48px"}}):e.createElement(ae,{allSelected:bt,selectedRows:ut,selectableRowsComponent:H,selectableRowsComponentProps:$,selectableRowDisabled:D,rowData:At,keyField:c,mergeSelections:vt,onSelectAllRows:Ht})),Pe&&!Ne&&e.createElement(ve,null),nt.map((t=>e.createElement(ne,{key:t.id,column:t,selectedColumn:ht,disabled:X||0===Pt.length,pagination:de,paginationServer:L,persistSelectedOnSort:Ct,selectableRowsVisibleOnly:O,sortDirection:wt,sortIcon:$e,sortServer:Ie,onSort:Dt,onDragStart:at,onDragOver:rt,onDragEnd:st,onDragEnter:lt,onDragLeave:it,draggingColumnId:ot}))))),me&&e.createElement(v,{className:"rdt_TableHead",role:"rowgroup",fixedHeader:ie},e.createElement(R,{className:"rdt_TableHeadRow",role:"row",dense:w},me)),!Pt.length&&!X&&e.createElement(Re,null,te),X&&ee&&e.createElement(Ce,null,Z),!X&&Pt.length>0&&e.createElement(fe,{className:"rdt_TableBody",role:"rowgroup"},kt.map(((t,n)=>{const o=r(t,c),a=function(e=""){return"number"!=typeof e&&(!e||0===e.length)}(o)?n:o,l=m(t,ut,c),i=!!(Pe&&Be&&Be(t)),s=!!(Pe&&Me&&Me(t));return e.createElement(q,{id:a,key:a,keyField:c,"data-row-id":a,columns:nt,row:t,rowCount:Pt.length,rowIndex:n,selectableRows:x,expandableRows:Pe,expandableIcon:I,highlightOnHover:b,pointerOnHover:h,dense:w,expandOnRowClicked:ze,expandOnRowDoubleClicked:We,expandableRowsComponent:Te,expandableRowsComponentProps:_e,expandableRowsHideExpander:Ne,defaultExpanderDisabled:s,defaultExpanded:i,expandableInheritConditionalStyles:Ge,conditionalRowStyles:Qe,selected:l,selectableRowsHighlight:S,selectableRowsComponent:H,selectableRowsComponentProps:$,selectableRowDisabled:D,selectableRowsSingle:y,striped:u,onRowExpandToggled:F,onRowClicked:Ft,onRowDoubleClicked:jt,onSelectedRow:$t,draggingColumnId:ot,onDragStart:at,onDragOver:rt,onDragEnd:st,onDragEnter:lt,onDragLeave:it})})))))),Rt&&e.createElement("div",null,e.createElement(St,{onChangePage:It,onChangeRowsPerPage:Tt,rowCount:M||Pt.length,currentPage:pt,rowsPerPage:gt,direction:et,paginationRowsPerPageOptions:B,paginationIconLastPage:G,paginationIconFirstPage:V,paginationIconNext:U,paginationIconPrevious:Y,paginationComponentOptions:J})))}));export{G as Alignment,B as Direction,V as Media,W as STOP_PROP_TAG,qe as createTheme,Qe as default,Ke as defaultThemes};
