"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("react"),t=require("styled-components");function n(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}function o(e){if(e&&e.__esModule)return e;var t=Object.create(null);return e&&Object.keys(e).forEach((function(n){if("default"!==n){var o=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(t,n,o.get?o:{enumerable:!0,get:function(){return e[n]}})}})),t.default=e,Object.freeze(t)}var a,l=o(e),r=n(e),i=n(t);function s(e,t){return e[t]}function d(e,t){return t.split(".").reduce(((e,t)=>{const n=t.match(/[^\]\\[.]+/g);if(n&&n.length>1)for(let t=0;t<n.length;t++)return e[n[t]][n[t+1]];return e[t]}),e)}function c(e=[],t,n=0){return[...e.slice(0,n),t,...e.slice(n)]}function g(e=[],t,n="id"){const o=e.slice(),a=s(t,n);return a?o.splice(o.findIndex((e=>s(e,n)===a)),1):o.splice(o.findIndex((e=>e===t)),1),o}function u(e){return e.map(((e,t)=>{const n=Object.assign(Object.assign({},e),{sortable:e.sortable||!!e.sortFunction||void 0});return e.id||(n.id=t+1),n}))}function p(e,t){return Math.ceil(e/t)}function b(e,t){return Math.min(e,t)}!function(e){e.ASC="asc",e.DESC="desc"}(a||(a={}));const f=()=>null;function m(e,t=[],n=[]){let o={},a=[...n];return t.length&&t.forEach((t=>{if(!t.when||"function"!=typeof t.when)throw new Error('"when" must be defined in the conditional style object and must be function');t.when(e)&&(o=t.style||{},t.classNames&&(a=[...a,...t.classNames]),"function"==typeof t.style&&(o=t.style(e)||{}))})),{style:o,classNames:a.join(" ")}}function h(e,t=[],n="id"){const o=s(e,n);return o?t.some((e=>s(e,n)===o)):t.some((t=>t===e))}function w(e,t){return t?e.findIndex((e=>x(e.id,t))):-1}function x(e,t){return e==t}function C(e,t){const n=!e.toggleOnSelectedRowsChange;switch(t.type){case"SELECT_ALL_ROWS":{const{keyField:n,rows:o,rowCount:a,mergeSelections:l}=t,r=!e.allSelected,i=!e.toggleOnSelectedRowsChange;if(l){const t=r?[...e.selectedRows,...o.filter((t=>!h(t,e.selectedRows,n)))]:e.selectedRows.filter((e=>!h(e,o,n)));return Object.assign(Object.assign({},e),{allSelected:r,selectedCount:t.length,selectedRows:t,toggleOnSelectedRowsChange:i})}return Object.assign(Object.assign({},e),{allSelected:r,selectedCount:r?a:0,selectedRows:r?o:[],toggleOnSelectedRowsChange:i})}case"SELECT_SINGLE_ROW":{const{keyField:o,row:a,isSelected:l,rowCount:r,singleSelect:i}=t;return i?l?Object.assign(Object.assign({},e),{selectedCount:0,allSelected:!1,selectedRows:[],toggleOnSelectedRowsChange:n}):Object.assign(Object.assign({},e),{selectedCount:1,allSelected:!1,selectedRows:[a],toggleOnSelectedRowsChange:n}):l?Object.assign(Object.assign({},e),{selectedCount:e.selectedRows.length>0?e.selectedRows.length-1:0,allSelected:!1,selectedRows:g(e.selectedRows,a,o),toggleOnSelectedRowsChange:n}):Object.assign(Object.assign({},e),{selectedCount:e.selectedRows.length+1,allSelected:e.selectedRows.length+1===r,selectedRows:c(e.selectedRows,a),toggleOnSelectedRowsChange:n})}case"SELECT_MULTIPLE_ROWS":{const{keyField:o,selectedRows:a,totalRows:l,mergeSelections:r}=t;if(r){const t=[...e.selectedRows,...a.filter((t=>!h(t,e.selectedRows,o)))];return Object.assign(Object.assign({},e),{selectedCount:t.length,allSelected:!1,selectedRows:t,toggleOnSelectedRowsChange:n})}return Object.assign(Object.assign({},e),{selectedCount:a.length,allSelected:a.length===l,selectedRows:a,toggleOnSelectedRowsChange:n})}case"CLEAR_SELECTED_ROWS":{const{selectedRowsFlag:n}=t;return Object.assign(Object.assign({},e),{allSelected:!1,selectedCount:0,selectedRows:[],selectedRowsFlag:n})}case"SORT_CHANGE":{const{sortDirection:o,selectedColumn:a,clearSelectedOnSort:l}=t;return Object.assign(Object.assign(Object.assign({},e),{selectedColumn:a,sortDirection:o,currentPage:1}),l&&{allSelected:!1,selectedCount:0,selectedRows:[],toggleOnSelectedRowsChange:n})}case"CHANGE_PAGE":{const{page:o,paginationServer:a,visibleOnly:l,persistSelectedOnPageChange:r}=t,i=a&&r,s=a&&!r||l;return Object.assign(Object.assign(Object.assign(Object.assign({},e),{currentPage:o}),i&&{allSelected:!1}),s&&{allSelected:!1,selectedCount:0,selectedRows:[],toggleOnSelectedRowsChange:n})}case"CHANGE_ROWS_PER_PAGE":{const{rowsPerPage:n,page:o}=t;return Object.assign(Object.assign({},e),{currentPage:o,rowsPerPage:n})}}}const y=t.css`
	pointer-events: none;
	opacity: 0.4;
`,v=i.default.div`
	position: relative;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	max-width: 100%;
	${({disabled:e})=>e&&y};
	${({theme:e})=>e.table.style};
`,R=t.css`
	position: sticky;
	position: -webkit-sticky; /* Safari */
	top: 0;
	z-index: 1;
`,S=i.default.div`
	display: flex;
	width: 100%;
	${({fixedHeader:e})=>e&&R};
	${({theme:e})=>e.head.style};
`,E=i.default.div`
	display: flex;
	align-items: stretch;
	width: 100%;
	${({theme:e})=>e.headRow.style};
	${({dense:e,theme:t})=>e&&t.headRow.denseStyle};
`,O=(e,...n)=>t.css`
		@media screen and (max-width: ${599}px) {
			${t.css(e,...n)}
		}
	`,P=(e,...n)=>t.css`
		@media screen and (max-width: ${959}px) {
			${t.css(e,...n)}
		}
	`,k=(e,...n)=>t.css`
		@media screen and (max-width: ${1280}px) {
			${t.css(e,...n)}
		}
	`,D=e=>(n,...o)=>t.css`
				@media screen and (max-width: ${e}px) {
					${t.css(n,...o)}
				}
			`,H=i.default.div`
	position: relative;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	line-height: normal;
	${({theme:e,headCell:t})=>e[t?"headCells":"cells"].style};
	${({noPadding:e})=>e&&"padding: 0"};
`,$=i.default(H)`
	flex-grow: ${({button:e,grow:t})=>0===t||e?0:t||1};
	flex-shrink: 0;
	flex-basis: 0;
	max-width: ${({maxWidth:e})=>e||"100%"};
	min-width: ${({minWidth:e})=>e||"100px"};
	${({width:e})=>e&&t.css`
			min-width: ${e};
			max-width: ${e};
		`};
	${({right:e})=>e&&"justify-content: flex-end"};
	${({button:e,center:t})=>(t||e)&&"justify-content: center"};
	${({compact:e,button:t})=>(e||t)&&"padding: 0"};

	/* handle hiding cells */
	${({hide:e})=>e&&"sm"===e&&O`
    display: none;
  `};
	${({hide:e})=>e&&"md"===e&&P`
    display: none;
  `};
	${({hide:e})=>e&&"lg"===e&&k`
    display: none;
  `};
	${({hide:e})=>e&&Number.isInteger(e)&&D(e)`
    display: none;
  `};
`,F=t.css`
	div:first-child {
		white-space: ${({wrapCell:e})=>e?"normal":"nowrap"};
		overflow: ${({allowOverflow:e})=>e?"visible":"hidden"};
		text-overflow: ellipsis;
	}
`,j=i.default($).attrs((e=>({style:e.style})))`
	${({renderAsCell:e})=>!e&&F};
	${({theme:e,isDragging:t})=>t&&e.cells.draggingStyle};
	${({cellStyle:e})=>e};
`;var T=l.memo((function({id:e,column:t,row:n,rowIndex:o,dataTag:a,isDragging:r,onDragStart:i,onDragOver:s,onDragEnd:c,onDragEnter:g,onDragLeave:u}){const{style:p,classNames:b}=m(n,t.conditionalCellStyles,["rdt_TableCell"]);return l.createElement(j,{id:e,"data-column-id":t.id,role:"cell",className:b,"data-tag":a,cellStyle:t.style,renderAsCell:!!t.cell,allowOverflow:t.allowOverflow,button:t.button,center:t.center,compact:t.compact,grow:t.grow,hide:t.hide,maxWidth:t.maxWidth,minWidth:t.minWidth,right:t.right,width:t.width,wrapCell:t.wrap,style:p,isDragging:r,onDragStart:i,onDragOver:s,onDragEnd:c,onDragEnter:g,onDragLeave:u},!t.cell&&l.createElement("div",{"data-tag":a},function(e,t,n,o){if(!t)return null;if("string"!=typeof t&&"function"!=typeof t)throw new Error("selector must be a . delimited string eg (my.property) or function (e.g. row => row.field");return n&&"function"==typeof n?n(e,o):t&&"function"==typeof t?t(e,o):"string"==typeof t?d(e,t):null}(n,t.selector,t.format,o)),t.cell&&t.cell(n,o,t,e))}));const I="input";var A=l.memo((function({name:e,component:t=I,componentOptions:n={style:{}},indeterminate:o=!1,checked:a=!1,disabled:r=!1,onClick:i=f}){const s=t,d=s!==I?n.style:(e=>Object.assign(Object.assign({fontSize:"18px"},!e&&{cursor:"pointer"}),{padding:0,marginTop:"1px",verticalAlign:"middle",position:"relative"}))(r),c=l.useMemo((()=>function(e,...t){let n;return Object.keys(e).map((t=>e[t])).forEach(((o,a)=>{const l=e;"function"==typeof o&&(n=Object.assign(Object.assign({},l),{[Object.keys(e)[a]]:o(...t)}))})),n||e}(n,o)),[n,o]);return l.createElement(s,Object.assign({type:"checkbox",ref:e=>{e&&(e.indeterminate=o)},style:d,onClick:r?f:i,name:e,"aria-label":e,checked:a,disabled:r},c,{onChange:f}))}));const M=i.default(H)`
	flex: 0 0 48px;
	min-width: 48px;
	justify-content: center;
	align-items: center;
	user-select: none;
	white-space: nowrap;
`;function L({name:e,keyField:t,row:n,rowCount:o,selected:a,selectableRowsComponent:r,selectableRowsComponentProps:i,selectableRowsSingle:s,selectableRowDisabled:d,onSelectedRow:c}){const g=!(!d||!d(n));return l.createElement(M,{onClick:e=>e.stopPropagation(),className:"rdt_TableCell",noPadding:!0},l.createElement(A,{name:e,component:r,componentOptions:i,checked:a,"aria-checked":a,onClick:()=>{c({type:"SELECT_SINGLE_ROW",row:n,isSelected:a,keyField:t,rowCount:o,singleSelect:s})},disabled:g}))}const _=i.default.button`
	display: inline-flex;
	align-items: center;
	user-select: none;
	white-space: nowrap;
	border: none;
	background-color: transparent;
	${({theme:e})=>e.expanderButton.style};
`;function z({disabled:e=!1,expanded:t=!1,expandableIcon:n,id:o,row:a,onToggled:r}){const i=t?n.expanded:n.collapsed;return l.createElement(_,{"aria-disabled":e,onClick:()=>r&&r(a),"data-testid":`expander-button-${o}`,disabled:e,"aria-label":t?"Collapse Row":"Expand Row",role:"button",type:"button"},i)}const N=i.default(H)`
	white-space: nowrap;
	font-weight: 400;
	min-width: 48px;
	${({theme:e})=>e.expanderCell.style};
`;function W({row:e,expanded:t=!1,expandableIcon:n,id:o,onToggled:a,disabled:r=!1}){return l.createElement(N,{onClick:e=>e.stopPropagation(),noPadding:!0,role:"cell"},l.createElement(z,{id:o,row:e,expanded:t,expandableIcon:n,disabled:r,onToggled:a}))}const B=i.default.div`
	width: 100%;
	box-sizing: border-box;
	${({theme:e})=>e.expanderRow.style};
	${({extendedRowStyle:e})=>e};
`;var G=l.memo((function({data:e,ExpanderComponent:t,expanderComponentProps:n,extendedRowStyle:o,extendedClassNames:a}){const r=["rdt_ExpanderRow",...a.split(" ").filter((e=>"rdt_TableRow"!==e))].join(" ");return l.createElement(B,{className:r,extendedRowStyle:o},l.createElement(t,Object.assign({data:e},n)))}));const V="allowRowEvents";var U,q,Y;exports.Direction=void 0,(U=exports.Direction||(exports.Direction={})).LTR="ltr",U.RTL="rtl",U.AUTO="auto",exports.Alignment=void 0,(q=exports.Alignment||(exports.Alignment={})).LEFT="left",q.RIGHT="right",q.CENTER="center",exports.Media=void 0,(Y=exports.Media||(exports.Media={})).SM="sm",Y.MD="md",Y.LG="lg";const K=t.css`
	&:hover {
		${({highlightOnHover:e,theme:t})=>e&&t.rows.highlightOnHoverStyle};
	}
`,J=t.css`
	&:hover {
		cursor: pointer;
	}
`,Q=i.default.div.attrs((e=>({style:e.style})))`
	display: flex;
	align-items: stretch;
	align-content: stretch;
	width: 100%;
	box-sizing: border-box;
	${({theme:e})=>e.rows.style};
	${({dense:e,theme:t})=>e&&t.rows.denseStyle};
	${({striped:e,theme:t})=>e&&t.rows.stripedStyle};
	${({highlightOnHover:e})=>e&&K};
	${({pointerOnHover:e})=>e&&J};
	${({selected:e,theme:t})=>e&&t.rows.selectedHighlightStyle};
`;function X({columns:e=[],conditionalRowStyles:t=[],defaultExpanded:n=!1,defaultExpanderDisabled:o=!1,dense:a=!1,expandableIcon:r,expandableRows:i=!1,expandableRowsComponent:d,expandableRowsComponentProps:c,expandableRowsHideExpander:g,expandOnRowClicked:u=!1,expandOnRowDoubleClicked:p=!1,highlightOnHover:b=!1,id:h,expandableInheritConditionalStyles:w,keyField:C,onRowClicked:y=f,onRowDoubleClicked:v=f,onRowMouseEnter:R=f,onRowMouseLeave:S=f,onRowExpandToggled:E=f,expandableCloseAllOnExpand:O=!1,expandableRowFlag:P=!1,onSelectedRow:k=f,pointerOnHover:D=!1,row:H,rowCount:$,rowIndex:F,selectableRowDisabled:j=null,selectableRows:I=!1,selectableRowsComponent:A,selectableRowsComponentProps:M,selectableRowsHighlight:_=!1,selectableRowsSingle:z=!1,selected:N,striped:B=!1,draggingColumnId:U,onDragStart:q,onDragOver:Y,onDragEnd:K,onDragEnter:J,onDragLeave:X}){const[Z,ee]=l.useState(n),[te,ne]=l.useState(P);l.useEffect((()=>{ee(n)}),[n]),l.useEffect((()=>{ne(P)}),[P]);const oe=l.useCallback((()=>{ne(!te),ee(!Z),E(!Z,H)}),[Z,E,H]),ae=D||i&&(u||p),le=l.useCallback((e=>{e.target&&e.target.getAttribute("data-tag")===V&&(y(H,e),!o&&i&&u&&oe())}),[o,u,i,oe,y,H]),re=l.useCallback((e=>{e.target&&e.target.getAttribute("data-tag")===V&&(v(H,e),!o&&i&&p&&oe())}),[o,p,i,oe,v,H]),ie=l.useCallback((e=>{R(H,e)}),[R,H]),se=l.useCallback((e=>{S(H,e)}),[S,H]),de=s(H,C),{style:ce,classNames:ge}=m(H,t,["rdt_TableRow"]),ue=_&&N,pe=w?ce:{},be=B&&F%2==0;const fe=O?te:Z;return l.createElement(l.Fragment,null,l.createElement(Q,{id:`row-${h}`,role:"row",striped:be,highlightOnHover:b,pointerOnHover:!o&&ae,dense:a,onClick:le,onDoubleClick:re,onMouseEnter:ie,onMouseLeave:se,className:ge,selected:ue,style:ce},I&&l.createElement(L,{name:`select-row-${de}`,keyField:C,row:H,rowCount:$,selected:N,selectableRowsComponent:A,selectableRowsComponentProps:M,selectableRowDisabled:j,selectableRowsSingle:z,onSelectedRow:k}),i&&!g&&l.createElement(W,{id:de,expandableIcon:r,expanded:O?te:Z,row:H,onToggled:oe,disabled:o}),e.map((e=>e.omit?null:l.createElement(T,{id:`cell-${e.id}-${de}`,key:`cell-${e.id}-${de}`,dataTag:e.ignoreRowClick||e.button?null:V,column:e,row:H,rowIndex:F,isDragging:x(U,e.id),onDragStart:q,onDragOver:Y,onDragEnd:K,onDragEnter:J,onDragLeave:X})))),i&&fe&&l.createElement(G,{key:`expander1-${de}`,data:H,extendedRowStyle:pe,extendedClassNames:ge,ExpanderComponent:d,expanderComponentProps:c}))}const Z=i.default.span`
	padding: 2px;
	color: inherit;
	flex-grow: 0;
	flex-shrink: 0;
	${({sortActive:e})=>e?"opacity: 1":"opacity: 0"};
	${({sortDirection:e})=>"desc"===e&&"transform: rotate(180deg)"};
`,ee=({sortActive:e,sortDirection:t})=>r.default.createElement(Z,{sortActive:e,sortDirection:t},"▲"),te=i.default($)`
	${({button:e})=>e&&"text-align: center"};
	${({theme:e,isDragging:t})=>t&&e.headCells.draggingStyle};
`,ne=t.css`
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

	${({sortActive:e})=>!e&&t.css`
			&:hover,
			&:focus {
				opacity: 0.7;

				span,
				span.__rdt_custom_sort_icon__ * {
					opacity: 0.7;
				}
			}
		`};
`,oe=i.default.div`
	display: inline-flex;
	align-items: center;
	justify-content: inherit;
	height: 100%;
	width: 100%;
	outline: none;
	user-select: none;
	overflow: hidden;
	${({disabled:e})=>!e&&ne};
`,ae=i.default.div`
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;var le=l.memo((function({column:e,disabled:t,draggingColumnId:n,selectedColumn:o={},sortDirection:r,sortIcon:i,sortServer:s,pagination:d,paginationServer:c,persistSelectedOnSort:g,selectableRowsVisibleOnly:u,onSort:p,onDragStart:b,onDragOver:f,onDragEnd:m,onDragEnter:h,onDragLeave:w}){l.useEffect((()=>{"string"==typeof e.selector&&console.error(`Warning: ${e.selector} is a string based column selector which has been deprecated as of v7 and will be removed in v8. Instead, use a selector function e.g. row => row[field]...`)}),[]);const[C,y]=l.useState(!1),v=l.useRef(null);if(l.useEffect((()=>{v.current&&y(v.current.scrollWidth>v.current.clientWidth)}),[C]),e.omit)return null;const R=()=>{if(!e.sortable&&!e.selector)return;let t=r;x(o.id,e.id)&&(t=r===a.ASC?a.DESC:a.ASC),p({type:"SORT_CHANGE",sortDirection:t,selectedColumn:e,clearSelectedOnSort:d&&c&&!g||s||u})},S=e=>l.createElement(ee,{sortActive:e,sortDirection:r}),E=()=>l.createElement("span",{className:[r,"__rdt_custom_sort_icon__"].join(" ")},i),O=!(!e.sortable||!x(o.id,e.id)),P=!e.sortable||t,k=e.sortable&&!i&&!e.right,D=e.sortable&&!i&&e.right,H=e.sortable&&i&&!e.right,$=e.sortable&&i&&e.right;return l.createElement(te,{"data-column-id":e.id,className:"rdt_TableCol",headCell:!0,allowOverflow:e.allowOverflow,button:e.button,compact:e.compact,grow:e.grow,hide:e.hide,maxWidth:e.maxWidth,minWidth:e.minWidth,right:e.right,center:e.center,width:e.width,draggable:e.reorder,isDragging:x(e.id,n),onDragStart:b,onDragOver:f,onDragEnd:m,onDragEnter:h,onDragLeave:w},e.name&&l.createElement(oe,{"data-column-id":e.id,"data-sort-id":e.id,role:"columnheader",tabIndex:0,className:"rdt_TableCol_Sortable",onClick:P?void 0:R,onKeyPress:P?void 0:e=>{"Enter"===e.key&&R()},sortActive:!P&&O,disabled:P},!P&&$&&E(),!P&&D&&S(O),"string"==typeof e.name?l.createElement(ae,{title:C?e.name:void 0,ref:v,"data-column-id":e.id},e.name):e.name,!P&&H&&E(),!P&&k&&S(O)))}));const re=i.default(H)`
	flex: 0 0 48px;
	justify-content: center;
	align-items: center;
	user-select: none;
	white-space: nowrap;
	font-size: unset;
`;function ie({headCell:e=!0,rowData:t,keyField:n,allSelected:o,mergeSelections:a,selectedRows:r,selectableRowsComponent:i,selectableRowsComponentProps:s,selectableRowDisabled:d,onSelectAllRows:c}){const g=r.length>0&&!o,u=d?t.filter((e=>!d(e))):t,p=0===u.length,b=Math.min(t.length,u.length);return l.createElement(re,{className:"rdt_TableCol",headCell:e,noPadding:!0},l.createElement(A,{name:"select-all-rows",component:i,componentOptions:s,onClick:()=>{c({type:"SELECT_ALL_ROWS",rows:u,rowCount:b,mergeSelections:a,keyField:n})},checked:o,indeterminate:g,disabled:p}))}function se(e=exports.Direction.AUTO){const t="object"==typeof window,[n,o]=l.useState(!1);return l.useEffect((()=>{if(t)if("auto"!==e)o("rtl"===e);else{const e=!(!window.document||!window.document.createElement),t=document.getElementsByTagName("BODY")[0],n=document.getElementsByTagName("HTML")[0],a="rtl"===t.dir||"rtl"===n.dir;o(e&&a)}}),[e,t]),n}const de=i.default.div`
	display: flex;
	align-items: center;
	flex: 1 0 auto;
	height: 100%;
	color: ${({theme:e})=>e.contextMenu.fontColor};
	font-size: ${({theme:e})=>e.contextMenu.fontSize};
	font-weight: 400;
`,ce=i.default.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	flex-wrap: wrap;
`,ge=i.default.div`
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
`;function ue({contextMessage:e,contextActions:t,contextComponent:n,selectedCount:o,direction:a}){const r=se(a),i=o>0;return n?l.createElement(ge,{visible:i},l.cloneElement(n,{selectedCount:o})):l.createElement(ge,{visible:i,rtl:r},l.createElement(de,null,((e,t,n)=>{if(0===t)return null;const o=1===t?e.singular:e.plural;return n?`${t} ${e.message||""} ${o}`:`${t} ${o} ${e.message||""}`})(e,o,r)),l.createElement(ce,null,t))}const pe=i.default.div`
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
`,be=i.default.div`
	flex: 1 0 auto;
	color: ${({theme:e})=>e.header.fontColor};
	font-size: ${({theme:e})=>e.header.fontSize};
	font-weight: 400;
`,fe=i.default.div`
	flex: 1 0 auto;
	display: flex;
	align-items: center;
	justify-content: flex-end;

	> * {
		margin-left: 5px;
	}
`,me=({title:e,actions:t=null,contextMessage:n,contextActions:o,contextComponent:a,selectedCount:r,direction:i,showMenu:s=!0})=>l.createElement(pe,{className:"rdt_TableHeader",role:"heading","aria-level":1},l.createElement(be,null,e),t&&l.createElement(fe,null,t),s&&l.createElement(ue,{contextMessage:n,contextActions:o,contextComponent:a,direction:i,selectedCount:r}));function he(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var a=0;for(o=Object.getOwnPropertySymbols(e);a<o.length;a++)t.indexOf(o[a])<0&&Object.prototype.propertyIsEnumerable.call(e,o[a])&&(n[o[a]]=e[o[a]])}return n}"function"==typeof SuppressedError&&SuppressedError;const we={left:"flex-start",right:"flex-end",center:"center"},xe=i.default.header`
	position: relative;
	display: flex;
	flex: 1 1 auto;
	box-sizing: border-box;
	align-items: center;
	padding: 4px 16px 4px 24px;
	width: 100%;
	justify-content: ${({align:e})=>we[e]};
	flex-wrap: ${({wrapContent:e})=>e?"wrap":"nowrap"};
	${({theme:e})=>e.subHeader.style}
`,Ce=e=>{var{align:t="right",wrapContent:n=!0}=e,o=he(e,["align","wrapContent"]);return l.createElement(xe,Object.assign({align:t,wrapContent:n},o))},ye=i.default.div`
	display: flex;
	flex-direction: column;
`,ve=i.default.div`
	position: relative;
	width: 100%;
	border-radius: inherit;
	${({responsive:e,fixedHeader:n})=>e&&t.css`
			overflow-x: auto;

			// hidden prevents vertical scrolling in firefox when fixedHeader is disabled
			overflow-y: ${n?"auto":"hidden"};
			min-height: 0;
		`};

	${({fixedHeader:e=!1,fixedHeaderScrollHeight:n="100vh"})=>e&&t.css`
			max-height: ${n};
			-webkit-overflow-scrolling: touch;
		`};

	${({theme:e})=>e.responsiveWrapper.style};
`,Re=i.default.div`
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	${e=>e.theme.progress.style};
`,Se=i.default.div`
	position: relative;
	width: 100%;
	${({theme:e})=>e.tableWrapper.style};
`,Ee=i.default(H)`
	white-space: nowrap;
	${({theme:e})=>e.expanderCell.style};
`,Oe=i.default.div`
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	${({theme:e})=>e.noData.style};
`,Pe=()=>r.default.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},r.default.createElement("path",{d:"M7 10l5 5 5-5z"}),r.default.createElement("path",{d:"M0 0h24v24H0z",fill:"none"})),ke=i.default.select`
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
`,De=i.default.div`
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
`,He=e=>{var{defaultValue:t,onChange:n}=e,o=he(e,["defaultValue","onChange"]);return l.createElement(De,null,l.createElement(ke,Object.assign({onChange:n,defaultValue:t},o)),l.createElement(Pe,null))},$e={columns:[],data:[],title:"",keyField:"id",selectableRows:!1,selectableRowsHighlight:!1,selectableRowsNoSelectAll:!1,selectableRowSelected:null,selectableRowDisabled:null,selectableRowsComponent:"input",selectableRowsComponentProps:{},selectableRowsVisibleOnly:!1,selectableRowsSingle:!1,clearSelectedRows:!1,expandableRows:!1,expandableRowDisabled:null,expandableRowExpanded:null,expandOnRowClicked:!1,expandableRowsHideExpander:!1,expandOnRowDoubleClicked:!1,expandableInheritConditionalStyles:!1,expandableRowsComponent:function(){return r.default.createElement("div",null,"To add an expander pass in a component instance via ",r.default.createElement("strong",null,"expandableRowsComponent"),". You can then access props.data from this component.")},expandableIcon:{collapsed:r.default.createElement((()=>r.default.createElement("svg",{fill:"currentColor",height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"},r.default.createElement("path",{d:"M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"}),r.default.createElement("path",{d:"M0-.25h24v24H0z",fill:"none"}))),null),expanded:r.default.createElement((()=>r.default.createElement("svg",{fill:"currentColor",height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"},r.default.createElement("path",{d:"M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"}),r.default.createElement("path",{d:"M0-.75h24v24H0z",fill:"none"}))),null)},expandableRowsComponentProps:{},progressPending:!1,progressComponent:r.default.createElement("div",{style:{fontSize:"24px",fontWeight:700,padding:"24px"}},"Loading..."),persistTableHead:!1,sortIcon:null,sortFunction:null,sortServer:!1,striped:!1,highlightOnHover:!1,pointerOnHover:!1,noContextMenu:!1,contextMessage:{singular:"item",plural:"items",message:"selected"},actions:null,contextActions:null,contextComponent:null,defaultSortFieldId:null,defaultSortAsc:!0,responsive:!0,noDataComponent:r.default.createElement("div",{style:{padding:"24px"}},"There are no records to display"),disabled:!1,noTableHead:!1,noHeader:!1,subHeader:!1,subHeaderAlign:exports.Alignment.RIGHT,subHeaderWrap:!0,subHeaderComponent:null,fixedHeader:!1,fixedHeaderScrollHeight:"100vh",pagination:!1,paginationServer:!1,paginationServerOptions:{persistSelectedOnSort:!1,persistSelectedOnPageChange:!1},paginationDefaultPage:1,paginationResetDefaultPage:!1,paginationTotalRows:0,paginationPerPage:10,paginationRowsPerPageOptions:[10,15,20,25,30],paginationComponent:null,paginationComponentOptions:{},paginationIconFirstPage:r.default.createElement((()=>r.default.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},r.default.createElement("path",{d:"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"}),r.default.createElement("path",{fill:"none",d:"M24 24H0V0h24v24z"}))),null),paginationIconLastPage:r.default.createElement((()=>r.default.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},r.default.createElement("path",{d:"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"}),r.default.createElement("path",{fill:"none",d:"M0 0h24v24H0V0z"}))),null),paginationIconNext:r.default.createElement((()=>r.default.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},r.default.createElement("path",{d:"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"}),r.default.createElement("path",{d:"M0 0h24v24H0z",fill:"none"}))),null),paginationIconPrevious:r.default.createElement((()=>r.default.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},r.default.createElement("path",{d:"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"}),r.default.createElement("path",{d:"M0 0h24v24H0z",fill:"none"}))),null),dense:!1,conditionalRowStyles:[],theme:"default",customStyles:{},direction:exports.Direction.AUTO,onChangePage:f,onChangeRowsPerPage:f,onRowClicked:f,onRowDoubleClicked:f,onRowMouseEnter:f,onRowMouseLeave:f,onRowExpandToggled:f,expandableCloseAllOnExpand:!1,onSelectedRowsChange:f,onSort:f,onColumnOrderChange:f},Fe={rowsPerPageText:"Rows per page:",rangeSeparatorText:"of",noRowsPerPage:!1,selectAllRowsItem:!1,selectAllRowsItemText:"All"},je=i.default.nav`
	display: flex;
	flex: 1 1 auto;
	justify-content: flex-end;
	align-items: center;
	box-sizing: border-box;
	padding-right: 8px;
	padding-left: 8px;
	width: 100%;
	${({theme:e})=>e.pagination.style};
`,Te=i.default.button`
	position: relative;
	display: block;
	user-select: none;
	border: none;
	${({theme:e})=>e.pagination.pageButtonsStyle};
	${({isRTL:e})=>e&&"transform: scale(-1, -1)"};
`,Ie=i.default.div`
	display: flex;
	align-items: center;
	border-radius: 4px;
	white-space: nowrap;
	${O`
    width: 100%;
    justify-content: space-around;
  `};
`,Ae=i.default.span`
	flex-shrink: 1;
	user-select: none;
`,Me=i.default(Ae)`
	margin: 0 24px;
`,Le=i.default(Ae)`
	margin: 0 4px;
`;var _e=l.memo((function({rowsPerPage:e,rowCount:t,currentPage:n,direction:o=$e.direction,paginationRowsPerPageOptions:a=$e.paginationRowsPerPageOptions,paginationIconLastPage:r=$e.paginationIconLastPage,paginationIconFirstPage:i=$e.paginationIconFirstPage,paginationIconNext:s=$e.paginationIconNext,paginationIconPrevious:d=$e.paginationIconPrevious,paginationComponentOptions:c=$e.paginationComponentOptions,onChangeRowsPerPage:g=$e.onChangeRowsPerPage,onChangePage:u=$e.onChangePage}){const b=(()=>{const e="object"==typeof window;function t(){return{width:e?window.innerWidth:void 0,height:e?window.innerHeight:void 0}}const[n,o]=l.useState(t);return l.useEffect((()=>{if(!e)return()=>null;function n(){o(t())}return window.addEventListener("resize",n),()=>window.removeEventListener("resize",n)}),[]),n})(),f=se(o),m=b.width&&b.width>599,h=p(t,e),w=n*e,x=w-e+1,C=1===n,y=n===h,v=Object.assign(Object.assign({},Fe),c),R=n===h?`${x}-${t} ${v.rangeSeparatorText} ${t}`:`${x}-${w} ${v.rangeSeparatorText} ${t}`,S=l.useCallback((()=>u(n-1)),[n,u]),E=l.useCallback((()=>u(n+1)),[n,u]),O=l.useCallback((()=>u(1)),[u]),P=l.useCallback((()=>u(p(t,e))),[u,t,e]),k=l.useCallback((e=>g(Number(e.target.value),n)),[n,g]),D=a.map((e=>l.createElement("option",{key:e,value:e},e)));v.selectAllRowsItem&&D.push(l.createElement("option",{key:-1,value:t},v.selectAllRowsItemText));const H=l.createElement(He,{onChange:k,defaultValue:e,"aria-label":v.rowsPerPageText},D);return l.createElement(je,{className:"rdt_Pagination"},!v.noRowsPerPage&&m&&l.createElement(l.Fragment,null,l.createElement(Le,null,v.rowsPerPageText),H),m&&l.createElement(Me,null,R),l.createElement(Ie,null,l.createElement(Te,{id:"pagination-first-page",type:"button","aria-label":"First Page","aria-disabled":C,onClick:O,disabled:C,isRTL:f},i),l.createElement(Te,{id:"pagination-previous-page",type:"button","aria-label":"Previous Page","aria-disabled":C,onClick:S,disabled:C,isRTL:f},d),!v.noRowsPerPage&&!m&&H,l.createElement(Te,{id:"pagination-next-page",type:"button","aria-label":"Next Page","aria-disabled":y,onClick:E,disabled:y,isRTL:f},s),l.createElement(Te,{id:"pagination-last-page",type:"button","aria-label":"Last Page","aria-disabled":y,onClick:P,disabled:y,isRTL:f},r)))}));const ze=(e,t)=>{const n=l.useRef(!0);l.useEffect((()=>{n.current?n.current=!1:e()}),t)};var Ne=function(e){return function(e){return!!e&&"object"==typeof e}(e)&&!function(e){var t=Object.prototype.toString.call(e);return"[object RegExp]"===t||"[object Date]"===t||function(e){return e.$$typeof===We}(e)}(e)};var We="function"==typeof Symbol&&Symbol.for?Symbol.for("react.element"):60103;function Be(e,t){return!1!==t.clone&&t.isMergeableObject(e)?Ye((n=e,Array.isArray(n)?[]:{}),e,t):e;var n}function Ge(e,t,n){return e.concat(t).map((function(e){return Be(e,n)}))}function Ve(e){return Object.keys(e).concat(function(e){return Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e).filter((function(t){return Object.propertyIsEnumerable.call(e,t)})):[]}(e))}function Ue(e,t){try{return t in e}catch(e){return!1}}function qe(e,t,n){var o={};return n.isMergeableObject(e)&&Ve(e).forEach((function(t){o[t]=Be(e[t],n)})),Ve(t).forEach((function(a){(function(e,t){return Ue(e,t)&&!(Object.hasOwnProperty.call(e,t)&&Object.propertyIsEnumerable.call(e,t))})(e,a)||(Ue(e,a)&&n.isMergeableObject(t[a])?o[a]=function(e,t){if(!t.customMerge)return Ye;var n=t.customMerge(e);return"function"==typeof n?n:Ye}(a,n)(e[a],t[a],n):o[a]=Be(t[a],n))})),o}function Ye(e,t,n){(n=n||{}).arrayMerge=n.arrayMerge||Ge,n.isMergeableObject=n.isMergeableObject||Ne,n.cloneUnlessOtherwiseSpecified=Be;var o=Array.isArray(t);return o===Array.isArray(e)?o?n.arrayMerge(e,t,n):qe(e,t,n):Be(t,n)}Ye.all=function(e,t){if(!Array.isArray(e))throw new Error("first argument should be an array");return e.reduce((function(e,n){return Ye(e,n,t)}),{})};var Ke=Ye;const Je={text:{primary:"rgba(0, 0, 0, 0.87)",secondary:"rgba(0, 0, 0, 0.54)",disabled:"rgba(0, 0, 0, 0.38)"},background:{default:"#FFFFFF"},context:{background:"#e3f2fd",text:"rgba(0, 0, 0, 0.87)"},divider:{default:"rgba(0,0,0,.12)"},button:{default:"rgba(0,0,0,.54)",focus:"rgba(0,0,0,.12)",hover:"rgba(0,0,0,.12)",disabled:"rgba(0, 0, 0, .18)"},selected:{default:"#e3f2fd",text:"rgba(0, 0, 0, 0.87)"},highlightOnHover:{default:"#EEEEEE",text:"rgba(0, 0, 0, 0.87)"},striped:{default:"#FAFAFA",text:"rgba(0, 0, 0, 0.87)"}},Qe={default:Je,light:Je,dark:{text:{primary:"#FFFFFF",secondary:"rgba(255, 255, 255, 0.7)",disabled:"rgba(0,0,0,.12)"},background:{default:"#424242"},context:{background:"#E91E63",text:"#FFFFFF"},divider:{default:"rgba(81, 81, 81, 1)"},button:{default:"#FFFFFF",focus:"rgba(255, 255, 255, .54)",hover:"rgba(255, 255, 255, .12)",disabled:"rgba(255, 255, 255, .18)"},selected:{default:"rgba(0, 0, 0, .7)",text:"#FFFFFF"},highlightOnHover:{default:"rgba(0, 0, 0, .7)",text:"#FFFFFF"},striped:{default:"rgba(0, 0, 0, .87)",text:"#FFFFFF"}}};function Xe(e,t,n,o){const[r,i]=l.useState((()=>u(e))),[s,d]=l.useState(""),c=l.useRef("");ze((()=>{i(u(e))}),[e]);const g=l.useCallback((e=>{var t,n,o;const{attributes:a}=e.target,l=null===(t=a.getNamedItem("data-column-id"))||void 0===t?void 0:t.value;l&&(c.current=(null===(o=null===(n=r[w(r,l)])||void 0===n?void 0:n.id)||void 0===o?void 0:o.toString())||"",d(c.current))}),[r]),p=l.useCallback((e=>{var n;const{attributes:o}=e.target,a=null===(n=o.getNamedItem("data-column-id"))||void 0===n?void 0:n.value;if(a&&c.current&&a!==c.current){const e=w(r,c.current),n=w(r,a),o=[...r];o[e]=r[n],o[n]=r[e],i(o),t(o)}}),[t,r]),b=l.useCallback((e=>{e.preventDefault()}),[]),f=l.useCallback((e=>{e.preventDefault()}),[]),m=l.useCallback((e=>{e.preventDefault(),c.current="",d("")}),[]),h=function(e=!1){return e?a.ASC:a.DESC}(o),x=l.useMemo((()=>r[w(r,null==n?void 0:n.toString())]||{}),[n,r]);return{tableColumns:r,draggingColumnId:s,handleDragStart:g,handleDragEnter:p,handleDragOver:b,handleDragLeave:f,handleDragEnd:m,defaultSortDirection:h,defaultSortColumn:x}}var Ze=l.memo((function(e){const{data:n=$e.data,columns:o=$e.columns,title:r=$e.title,actions:i=$e.actions,keyField:c=$e.keyField,striped:g=$e.striped,highlightOnHover:u=$e.highlightOnHover,pointerOnHover:f=$e.pointerOnHover,dense:m=$e.dense,selectableRows:w=$e.selectableRows,selectableRowsSingle:x=$e.selectableRowsSingle,selectableRowsHighlight:y=$e.selectableRowsHighlight,selectableRowsNoSelectAll:R=$e.selectableRowsNoSelectAll,selectableRowsVisibleOnly:O=$e.selectableRowsVisibleOnly,selectableRowSelected:P=$e.selectableRowSelected,selectableRowDisabled:k=$e.selectableRowDisabled,selectableRowsComponent:D=$e.selectableRowsComponent,selectableRowsComponentProps:$=$e.selectableRowsComponentProps,onRowExpandToggled:F=$e.onRowExpandToggled,expandableCloseAllOnExpand:j=$e.expandableCloseAllOnExpand,onSelectedRowsChange:T=$e.onSelectedRowsChange,expandableIcon:I=$e.expandableIcon,onChangeRowsPerPage:A=$e.onChangeRowsPerPage,onChangePage:M=$e.onChangePage,paginationServer:L=$e.paginationServer,paginationServerOptions:_=$e.paginationServerOptions,paginationTotalRows:z=$e.paginationTotalRows,paginationDefaultPage:N=$e.paginationDefaultPage,paginationResetDefaultPage:W=$e.paginationResetDefaultPage,paginationPerPage:B=$e.paginationPerPage,paginationRowsPerPageOptions:G=$e.paginationRowsPerPageOptions,paginationIconLastPage:V=$e.paginationIconLastPage,paginationIconFirstPage:U=$e.paginationIconFirstPage,paginationIconNext:q=$e.paginationIconNext,paginationIconPrevious:Y=$e.paginationIconPrevious,paginationComponent:K=$e.paginationComponent,paginationComponentOptions:J=$e.paginationComponentOptions,responsive:Q=$e.responsive,progressPending:Z=$e.progressPending,progressComponent:ee=$e.progressComponent,persistTableHead:te=$e.persistTableHead,noDataComponent:ne=$e.noDataComponent,disabled:oe=$e.disabled,noTableHead:ae=$e.noTableHead,noHeader:re=$e.noHeader,fixedHeader:se=$e.fixedHeader,fixedHeaderScrollHeight:de=$e.fixedHeaderScrollHeight,pagination:ce=$e.pagination,subHeader:ge=$e.subHeader,subHeaderAlign:ue=$e.subHeaderAlign,subHeaderWrap:pe=$e.subHeaderWrap,subHeaderComponent:be=$e.subHeaderComponent,noContextMenu:fe=$e.noContextMenu,contextMessage:he=$e.contextMessage,contextActions:we=$e.contextActions,contextComponent:xe=$e.contextComponent,expandableRows:Pe=$e.expandableRows,onRowClicked:ke=$e.onRowClicked,onRowDoubleClicked:De=$e.onRowDoubleClicked,onRowMouseEnter:He=$e.onRowMouseEnter,onRowMouseLeave:Fe=$e.onRowMouseLeave,sortIcon:je=$e.sortIcon,onSort:Te=$e.onSort,sortFunction:Ie=$e.sortFunction,sortServer:Ae=$e.sortServer,expandableRowsComponent:Me=$e.expandableRowsComponent,expandableRowsComponentProps:Le=$e.expandableRowsComponentProps,expandableRowDisabled:Ne=$e.expandableRowDisabled,expandableRowsHideExpander:We=$e.expandableRowsHideExpander,expandOnRowClicked:Be=$e.expandOnRowClicked,expandOnRowDoubleClicked:Ge=$e.expandOnRowDoubleClicked,expandableRowExpanded:Ve=$e.expandableRowExpanded,expandableInheritConditionalStyles:Ue=$e.expandableInheritConditionalStyles,defaultSortFieldId:qe=$e.defaultSortFieldId,defaultSortAsc:Ye=$e.defaultSortAsc,clearSelectedRows:Je=$e.clearSelectedRows,conditionalRowStyles:Ze=$e.conditionalRowStyles,theme:et=$e.theme,customStyles:tt=$e.customStyles,direction:nt=$e.direction,onColumnOrderChange:ot=$e.onColumnOrderChange,className:at}=e,{tableColumns:lt,draggingColumnId:rt,handleDragStart:it,handleDragEnter:st,handleDragOver:dt,handleDragLeave:ct,handleDragEnd:gt,defaultSortDirection:ut,defaultSortColumn:pt}=Xe(o,ot,qe,Ye),[bt,ft]=l.useState(null),[{rowsPerPage:mt,currentPage:ht,selectedRows:wt,allSelected:xt,selectedCount:Ct,selectedColumn:yt,sortDirection:vt,toggleOnSelectedRowsChange:Rt},St]=l.useReducer(C,{allSelected:!1,selectedCount:0,selectedRows:[],selectedColumn:pt,toggleOnSelectedRowsChange:!1,sortDirection:ut,currentPage:N,rowsPerPage:B,selectedRowsFlag:!1,contextMessage:$e.contextMessage}),{persistSelectedOnSort:Et=!1,persistSelectedOnPageChange:Ot=!1}=_,Pt=!(!L||!Ot&&!Et),kt=ce&&!Z&&n.length>0,Dt=K||_e,Ht=l.useMemo((()=>((e={},t="default",n="default")=>{const o=Qe[t]?t:n;return Ke({table:{style:{color:(a=Qe[o]).text.primary,backgroundColor:a.background.default}},tableWrapper:{style:{display:"table"}},responsiveWrapper:{style:{}},header:{style:{fontSize:"22px",color:a.text.primary,backgroundColor:a.background.default,minHeight:"56px",paddingLeft:"16px",paddingRight:"8px"}},subHeader:{style:{backgroundColor:a.background.default,minHeight:"52px"}},head:{style:{color:a.text.primary,fontSize:"12px",fontWeight:500}},headRow:{style:{backgroundColor:a.background.default,minHeight:"52px",borderBottomWidth:"1px",borderBottomColor:a.divider.default,borderBottomStyle:"solid"},denseStyle:{minHeight:"32px"}},headCells:{style:{paddingLeft:"16px",paddingRight:"16px"},draggingStyle:{cursor:"move"}},contextMenu:{style:{backgroundColor:a.context.background,fontSize:"18px",fontWeight:400,color:a.context.text,paddingLeft:"16px",paddingRight:"8px",transform:"translate3d(0, -100%, 0)",transitionDuration:"125ms",transitionTimingFunction:"cubic-bezier(0, 0, 0.2, 1)",willChange:"transform"},activeStyle:{transform:"translate3d(0, 0, 0)"}},cells:{style:{paddingLeft:"16px",paddingRight:"16px",wordBreak:"break-word"},draggingStyle:{}},rows:{style:{fontSize:"13px",fontWeight:400,color:a.text.primary,backgroundColor:a.background.default,minHeight:"48px","&:not(:last-of-type)":{borderBottomStyle:"solid",borderBottomWidth:"1px",borderBottomColor:a.divider.default}},denseStyle:{minHeight:"32px"},selectedHighlightStyle:{"&:nth-of-type(n)":{color:a.selected.text,backgroundColor:a.selected.default,borderBottomColor:a.background.default}},highlightOnHoverStyle:{color:a.highlightOnHover.text,backgroundColor:a.highlightOnHover.default,transitionDuration:"0.15s",transitionProperty:"background-color",borderBottomColor:a.background.default,outlineStyle:"solid",outlineWidth:"1px",outlineColor:a.background.default},stripedStyle:{color:a.striped.text,backgroundColor:a.striped.default}},expanderRow:{style:{color:a.text.primary,backgroundColor:a.background.default}},expanderCell:{style:{flex:"0 0 48px"}},expanderButton:{style:{color:a.button.default,fill:a.button.default,backgroundColor:"transparent",borderRadius:"2px",transition:"0.25s",height:"100%",width:"100%","&:hover:enabled":{cursor:"pointer"},"&:disabled":{color:a.button.disabled},"&:hover:not(:disabled)":{cursor:"pointer",backgroundColor:a.button.hover},"&:focus":{outline:"none",backgroundColor:a.button.focus},svg:{margin:"auto"}}},pagination:{style:{color:a.text.secondary,fontSize:"13px",minHeight:"56px",backgroundColor:a.background.default,borderTopStyle:"solid",borderTopWidth:"1px",borderTopColor:a.divider.default},pageButtonsStyle:{borderRadius:"50%",height:"40px",width:"40px",padding:"8px",margin:"px",cursor:"pointer",transition:"0.4s",color:a.button.default,fill:a.button.default,backgroundColor:"transparent","&:disabled":{cursor:"unset",color:a.button.disabled,fill:a.button.disabled},"&:hover:not(:disabled)":{backgroundColor:a.button.hover},"&:focus":{outline:"none",backgroundColor:a.button.focus}}},noData:{style:{display:"flex",alignItems:"center",justifyContent:"center",color:a.text.primary,backgroundColor:a.background.default}},progress:{style:{display:"flex",alignItems:"center",justifyContent:"center",color:a.text.primary,backgroundColor:a.background.default}}},e);var a})(tt,et)),[tt,et]),$t=l.useMemo((()=>Object.assign({},"auto"!==nt&&{dir:nt})),[nt]),Ft=l.useMemo((()=>{if(Ae)return n;if((null==yt?void 0:yt.sortFunction)&&"function"==typeof yt.sortFunction){const e=yt.sortFunction,t=vt===a.ASC?e:(t,n)=>-1*e(t,n);return[...n].sort(t)}return function(e,t,n,o){return t?o&&"function"==typeof o?o(e.slice(0),t,n):e.slice(0).sort(((e,o)=>{let a,l;if("string"==typeof t?(a=d(e,t),l=d(o,t)):(a=t(e),l=t(o)),"asc"===n){if(a<l)return-1;if(a>l)return 1}if("desc"===n){if(a>l)return-1;if(a<l)return 1}return 0})):e}(n,null==yt?void 0:yt.selector,vt,Ie)}),["sortServer",yt,vt,n,Ie]),jt=l.useMemo((()=>{const e=Ft.map((e=>{const t=Object.assign({},e);return j?bt&&bt.id==t.id?t.expandFlag=!0:t.expandFlag=!1:t.defaultExpanded||t.expandFlag?t.expandFlag=!0:t.expandFlag=!1,t}));if(ce&&!L){const t=ht*mt,n=t-mt;return e.slice(n,t)}return e}),[ht,ce,L,mt,Ft,bt]),Tt=l.useCallback((e=>{St(e)}),[]),It=l.useCallback((e=>{St(e)}),[]),At=l.useCallback((e=>{St(e)}),[]),Mt=l.useCallback(((e,t)=>ke(e,t)),[ke]),Lt=l.useCallback(((e,t)=>De(e,t)),[De]),_t=l.useCallback(((e,t)=>He(e,t)),[He]),zt=l.useCallback(((e,t)=>Fe(e,t)),[Fe]),Nt=l.useCallback((e=>St({type:"CHANGE_PAGE",page:e,paginationServer:L,visibleOnly:O,persistSelectedOnPageChange:Ot})),[L,Ot,O]),Wt=l.useCallback((e=>{const t=p(z||jt.length,e),n=b(ht,t);L||Nt(n),St({type:"CHANGE_ROWS_PER_PAGE",page:n,rowsPerPage:e})}),[ht,Nt,L,z,jt.length]),Bt=l.useCallback(((e,t)=>{F(e,t),ft(t)}),[F]);if(ce&&!L&&Ft.length>0&&0===jt.length){const e=p(Ft.length,mt),t=b(ht,e);Nt(t)}ze((()=>{T({allSelected:xt,selectedCount:Ct,selectedRows:wt.slice(0)})}),[Rt]),ze((()=>{Te(yt,vt,Ft.slice(0))}),[yt,vt]),ze((()=>{M(ht,z||Ft.length)}),[ht]),ze((()=>{A(mt,ht)}),[mt]),ze((()=>{Nt(N)}),[N,W]),ze((()=>{if(ce&&L&&z>0){const e=p(z,mt),t=b(ht,e);ht!==t&&Nt(t)}}),[z]),l.useEffect((()=>{St({type:"CLEAR_SELECTED_ROWS",selectedRowsFlag:Je})}),[x,Je]),l.useEffect((()=>{if(!P)return;const e=Ft.filter((e=>P(e))),t=x?e.slice(0,1):e;St({type:"SELECT_MULTIPLE_ROWS",keyField:c,selectedRows:t,totalRows:Ft.length,mergeSelections:Pt})}),[n,P]);const Gt=O?jt:Ft,Vt=Ot||x||R;return l.createElement(t.ThemeProvider,{theme:Ht},!re&&(!!r||!!i)&&l.createElement(me,{title:r,actions:i,showMenu:!fe,selectedCount:Ct,direction:nt,contextActions:we,contextComponent:xe,contextMessage:he}),ge&&l.createElement(Ce,{align:ue,wrapContent:pe},be),l.createElement(ve,Object.assign({responsive:Q,fixedHeader:se,fixedHeaderScrollHeight:de,className:at},$t),l.createElement(Se,null,Z&&!te&&l.createElement(Re,null,ee),l.createElement(v,{disabled:oe,className:"rdt_Table",role:"table"},!ae&&(!!te||Ft.length>0&&!Z)&&l.createElement(S,{className:"rdt_TableHead",role:"rowgroup",fixedHeader:se},l.createElement(E,{className:"rdt_TableHeadRow",role:"row",dense:m},w&&(Vt?l.createElement(H,{style:{flex:"0 0 48px"}}):l.createElement(ie,{allSelected:xt,selectedRows:wt,selectableRowsComponent:D,selectableRowsComponentProps:$,selectableRowDisabled:k,rowData:Gt,keyField:c,mergeSelections:Pt,onSelectAllRows:It})),Pe&&!We&&l.createElement(Ee,null),lt.map((e=>{const t=e.component?e.component:le;return l.createElement(t,{key:e.id,column:e,selectedColumn:yt,disabled:Z||0===Ft.length,pagination:ce,paginationServer:L,persistSelectedOnSort:Et,selectableRowsVisibleOnly:O,sortDirection:vt,sortIcon:je,sortServer:Ae,onSort:Tt,onDragStart:it,onDragOver:dt,onDragEnd:gt,onDragEnter:st,onDragLeave:ct,draggingColumnId:rt})})))),!Ft.length&&!Z&&l.createElement(Oe,null,ne),Z&&te&&l.createElement(Re,null,ee),!Z&&Ft.length>0&&l.createElement(ye,{className:"rdt_TableBody",role:"rowgroup"},jt.map(((e,t)=>{const n=s(e,c),o=function(e=""){return"number"!=typeof e&&(!e||0===e.length)}(n)?t:n,a=h(e,wt,c),r=!!(Pe&&Ve&&Ve(e)),i=!!(Pe&&Ne&&Ne(e));return l.createElement(X,{id:o,key:o,keyField:c,"data-row-id":o,columns:lt,row:e,rowCount:Ft.length,rowIndex:t,selectableRows:w,expandableRows:Pe,expandableIcon:I,highlightOnHover:u,pointerOnHover:f,dense:m,expandOnRowClicked:Be,expandOnRowDoubleClicked:Ge,expandableRowsComponent:Me,expandableRowsComponentProps:Le,expandableRowsHideExpander:We,defaultExpanderDisabled:i,defaultExpanded:r,expandableInheritConditionalStyles:Ue,conditionalRowStyles:Ze,selected:a,selectableRowsHighlight:y,selectableRowsComponent:D,selectableRowsComponentProps:$,selectableRowDisabled:k,selectableRowsSingle:x,striped:g,onRowExpandToggled:Bt,expandableCloseAllOnExpand:j,expandableRowFlag:e.expandFlag,onRowClicked:Mt,onRowDoubleClicked:Lt,onRowMouseEnter:_t,onRowMouseLeave:zt,onSelectedRow:At,draggingColumnId:rt,onDragStart:it,onDragOver:dt,onDragEnd:gt,onDragEnter:st,onDragLeave:ct})})))))),kt&&l.createElement("div",null,l.createElement(Dt,{onChangePage:Nt,onChangeRowsPerPage:Wt,rowCount:z||Ft.length,currentPage:ht,rowsPerPage:mt,direction:nt,paginationRowsPerPageOptions:G,paginationIconLastPage:V,paginationIconFirstPage:U,paginationIconNext:q,paginationIconPrevious:Y,paginationComponentOptions:J})))}));exports.STOP_PROP_TAG=V,exports.createTheme=function(e="default",t,n="default"){return Qe[e]||(Qe[e]=Ke(Qe[n],t||{})),Qe[e]=Ke(Qe[e],t||{}),Qe[e]},exports.default=Ze,exports.defaultThemes=Qe;
//# sourceMappingURL=index.cjs.js.map
