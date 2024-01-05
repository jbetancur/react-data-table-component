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
`,R=n.div`
	display: flex;
	width: 100%;
	${({fixedHeader:e})=>e&&y};
	${({theme:e})=>e.head.style};
`,v=n.div`
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
	`,k=e=>(t,...n)=>o`
				@media screen and (max-width: ${e}px) {
					${o(t,...n)}
				}
			`,P=n.div`
	position: relative;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	line-height: normal;
	${({theme:e,headCell:t})=>e[t?"headCells":"cells"].style};
	${({noPadding:e})=>e&&"padding: 0"};
`,D=n(P)`
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
	${({hide:e})=>e&&Number.isInteger(e)&&k(e)`
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
`;var F=e.memo((function({id:t,column:n,row:o,rowIndex:a,dataTag:l,isDragging:r,onDragStart:s,onDragOver:d,onDragEnd:c,onDragEnter:g,onDragLeave:p}){const{style:u,classNames:m}=b(o,n.conditionalCellStyles,["rdt_TableCell"]);return e.createElement($,{id:t,"data-column-id":n.id,role:"cell",className:m,"data-tag":l,cellStyle:n.style,renderAsCell:!!n.cell,allowOverflow:n.allowOverflow,button:n.button,center:n.center,compact:n.compact,grow:n.grow,hide:n.hide,maxWidth:n.maxWidth,minWidth:n.minWidth,right:n.right,width:n.width,wrapCell:n.wrap,style:u,isDragging:r,onDragStart:s,onDragOver:d,onDragEnd:c,onDragEnter:g,onDragLeave:p},!n.cell&&e.createElement("div",{"data-tag":l},function(e,t,n,o){if(!t)return null;if("string"!=typeof t&&"function"!=typeof t)throw new Error("selector must be a . delimited string eg (my.property) or function (e.g. row => row.field");return n&&"function"==typeof n?n(e,o):t&&"function"==typeof t?t(e,o):"string"==typeof t?i(e,t):null}(o,n.selector,n.format,a)),n.cell&&n.cell(o,a,n,t))}));const j="input";var I=e.memo((function({name:t,component:n=j,componentOptions:o={style:{}},indeterminate:a=!1,checked:l=!1,disabled:r=!1,onClick:i=u}){const s=n,d=s!==j?o.style:(e=>Object.assign(Object.assign({fontSize:"18px"},!e&&{cursor:"pointer"}),{padding:0,marginTop:"1px",verticalAlign:"middle",position:"relative"}))(r),c=e.useMemo((()=>function(e,...t){let n;return Object.keys(e).map((t=>e[t])).forEach(((o,a)=>{const l=e;"function"==typeof o&&(n=Object.assign(Object.assign({},l),{[Object.keys(e)[a]]:o(...t)}))})),n||e}(o,a)),[o,a]);return e.createElement(s,Object.assign({type:"checkbox",ref:e=>{e&&(e.indeterminate=a)},style:d,onClick:r?u:i,name:t,"aria-label":t,checked:l,disabled:r},c,{onChange:u}))}));const T=n(P)`
	flex: 0 0 48px;
	min-width: 48px;
	justify-content: center;
	align-items: center;
	user-select: none;
	white-space: nowrap;
`;function A({name:t,keyField:n,row:o,rowCount:a,selected:l,selectableRowsComponent:r,selectableRowsComponentProps:i,selectableRowsSingle:s,selectableRowDisabled:d,onSelectedRow:c}){const g=!(!d||!d(o));return e.createElement(T,{onClick:e=>e.stopPropagation(),className:"rdt_TableCell",noPadding:!0},e.createElement(I,{name:t,component:r,componentOptions:i,checked:l,"aria-checked":l,onClick:()=>{c({type:"SELECT_SINGLE_ROW",row:o,isSelected:l,keyField:n,rowCount:a,singleSelect:s})},disabled:g}))}const L=n.button`
	display: inline-flex;
	align-items: center;
	user-select: none;
	white-space: nowrap;
	border: none;
	background-color: transparent;
	${({theme:e})=>e.expanderButton.style};
`;function M({disabled:t=!1,expanded:n=!1,expandableIcon:o,id:a,row:l,onToggled:r}){const i=n?o.expanded:o.collapsed;return e.createElement(L,{"aria-disabled":t,onClick:()=>r&&r(l),"data-testid":`expander-button-${a}`,disabled:t,"aria-label":n?"Collapse Row":"Expand Row",role:"button",type:"button"},i)}const _=n(P)`
	white-space: nowrap;
	font-weight: 400;
	min-width: 48px;
	${({theme:e})=>e.expanderCell.style};
`;function N({row:t,expanded:n=!1,expandableIcon:o,id:a,onToggled:l,disabled:r=!1}){return e.createElement(_,{onClick:e=>e.stopPropagation(),noPadding:!0,role:"cell"},e.createElement(M,{id:a,row:t,expanded:n,expandableIcon:o,disabled:r,onToggled:l}))}const z=n.div`
	width: 100%;
	box-sizing: border-box;
	${({theme:e})=>e.expanderRow.style};
	${({extendedRowStyle:e})=>e};
`;var W=e.memo((function({data:t,ExpanderComponent:n,expanderComponentProps:o,extendedRowStyle:a,extendedClassNames:l}){const r=["rdt_ExpanderRow",...l.split(" ").filter((e=>"rdt_TableRow"!==e))].join(" ");return e.createElement(z,{className:r,extendedRowStyle:a},e.createElement(n,Object.assign({data:t},o)))}));const B="allowRowEvents";var G,V,U;!function(e){e.LTR="ltr",e.RTL="rtl",e.AUTO="auto"}(G||(G={})),function(e){e.LEFT="left",e.RIGHT="right",e.CENTER="center"}(V||(V={})),function(e){e.SM="sm",e.MD="md",e.LG="lg"}(U||(U={}));const Y=o`
	&:hover {
		${({highlightOnHover:e,theme:t})=>e&&t.rows.highlightOnHoverStyle};
	}
`,K=o`
	&:hover {
		cursor: pointer;
	}
`,q=n.div.attrs((e=>({style:e.style})))`
	display: flex;
	align-items: stretch;
	align-content: stretch;
	width: 100%;
	box-sizing: border-box;
	${({theme:e})=>e.rows.style};
	${({dense:e,theme:t})=>e&&t.rows.denseStyle};
	${({striped:e,theme:t})=>e&&t.rows.stripedStyle};
	${({highlightOnHover:e})=>e&&Y};
	${({pointerOnHover:e})=>e&&K};
	${({selected:e,theme:t})=>e&&t.rows.selectedHighlightStyle};
`;function J({columns:t=[],conditionalRowStyles:n=[],defaultExpanded:o=!1,defaultExpanderDisabled:a=!1,dense:l=!1,expandableIcon:i,expandableRows:s=!1,expandableRowsComponent:d,expandableRowsComponentProps:c,expandableRowsHideExpander:g,expandOnRowClicked:p=!1,expandOnRowDoubleClicked:m=!1,highlightOnHover:h=!1,id:f,expandableInheritConditionalStyles:x,keyField:C,onRowClicked:y=u,onRowDoubleClicked:R=u,onRowMouseEnter:v=u,onRowMouseLeave:S=u,onRowExpandToggled:E=u,expandableCloseAllOnExpand:O=!1,expandableRowFlag:k=!1,onSelectedRow:P=u,pointerOnHover:D=!1,row:H,rowCount:$,rowIndex:j,selectableRowDisabled:I=null,selectableRows:T=!1,selectableRowsComponent:L,selectableRowsComponentProps:M,selectableRowsHighlight:_=!1,selectableRowsSingle:z=!1,selected:G,striped:V=!1,draggingColumnId:U,onDragStart:Y,onDragOver:K,onDragEnd:J,onDragEnter:Q,onDragLeave:X}){const[Z,ee]=e.useState(o),[te,ne]=e.useState(k);e.useEffect((()=>{ee(o)}),[o]),e.useEffect((()=>{ne(k)}),[k]);const oe=e.useCallback((()=>{ne(!te),ee(!Z),E(!Z,H)}),[Z,E,H]),ae=D||s&&(p||m),le=e.useCallback((e=>{e.target&&e.target.getAttribute("data-tag")===B&&(y(H,e),!a&&s&&p&&oe())}),[a,p,s,oe,y,H]),re=e.useCallback((e=>{e.target&&e.target.getAttribute("data-tag")===B&&(R(H,e),!a&&s&&m&&oe())}),[a,m,s,oe,R,H]),ie=e.useCallback((e=>{v(H,e)}),[v,H]),se=e.useCallback((e=>{S(H,e)}),[S,H]),de=r(H,C),{style:ce,classNames:ge}=b(H,n,["rdt_TableRow"]),pe=_&&G,ue=x?ce:{},be=V&&j%2==0;const me=O?te:Z;return e.createElement(e.Fragment,null,e.createElement(q,{id:`row-${f}`,role:"row",striped:be,highlightOnHover:h,pointerOnHover:!a&&ae,dense:l,onClick:le,onDoubleClick:re,onMouseEnter:ie,onMouseLeave:se,className:ge,selected:pe,style:ce},T&&e.createElement(A,{name:`select-row-${de}`,keyField:C,row:H,rowCount:$,selected:G,selectableRowsComponent:L,selectableRowsComponentProps:M,selectableRowDisabled:I,selectableRowsSingle:z,onSelectedRow:P}),s&&!g&&e.createElement(N,{id:de,expandableIcon:i,expanded:O?te:Z,row:H,onToggled:oe,disabled:a}),t.map((t=>t.omit?null:e.createElement(F,{id:`cell-${t.id}-${de}`,key:`cell-${t.id}-${de}`,dataTag:t.ignoreRowClick||t.button?null:B,column:t,row:H,rowIndex:j,isDragging:w(U,t.id),onDragStart:Y,onDragOver:K,onDragEnd:J,onDragEnter:Q,onDragLeave:X})))),s&&me&&e.createElement(W,{key:`expander1-${de}`,data:H,extendedRowStyle:ue,extendedClassNames:ge,ExpanderComponent:d,expanderComponentProps:c}))}const Q=n.span`
	padding: 2px;
	color: inherit;
	flex-grow: 0;
	flex-shrink: 0;
	${({sortActive:e})=>e?"opacity: 1":"opacity: 0"};
	${({sortDirection:e})=>"desc"===e&&"transform: rotate(180deg)"};
`,X=({sortActive:e,sortDirection:n})=>t.createElement(Q,{sortActive:e,sortDirection:n},"▲"),Z=n(D)`
	${({button:e})=>e&&"text-align: center"};
	${({theme:e,isDragging:t})=>t&&e.headCells.draggingStyle};
`,ee=o`
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
`,te=n.div`
	display: inline-flex;
	align-items: center;
	justify-content: inherit;
	height: 100%;
	width: 100%;
	outline: none;
	user-select: none;
	overflow: hidden;
	${({disabled:e})=>!e&&ee};
`,ne=n.div`
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;var oe=e.memo((function({column:t,disabled:n,draggingColumnId:o,selectedColumn:a={},sortDirection:r,sortIcon:i,sortServer:s,pagination:d,paginationServer:c,persistSelectedOnSort:g,selectableRowsVisibleOnly:p,onSort:u,onDragStart:b,onDragOver:m,onDragEnd:h,onDragEnter:f,onDragLeave:x}){e.useEffect((()=>{"string"==typeof t.selector&&console.error(`Warning: ${t.selector} is a string based column selector which has been deprecated as of v7 and will be removed in v8. Instead, use a selector function e.g. row => row[field]...`)}),[]);const[C,y]=e.useState(!1),R=e.useRef(null);if(e.useEffect((()=>{R.current&&y(R.current.scrollWidth>R.current.clientWidth)}),[C]),t.omit)return null;const v=()=>{if(!t.sortable&&!t.selector)return;let e=r;w(a.id,t.id)&&(e=r===l.ASC?l.DESC:l.ASC),u({type:"SORT_CHANGE",sortDirection:e,selectedColumn:t,clearSelectedOnSort:d&&c&&!g||s||p})},S=t=>e.createElement(X,{sortActive:t,sortDirection:r}),E=()=>e.createElement("span",{className:[r,"__rdt_custom_sort_icon__"].join(" ")},i),O=!(!t.sortable||!w(a.id,t.id)),k=!t.sortable||n,P=t.sortable&&!i&&!t.right,D=t.sortable&&!i&&t.right,H=t.sortable&&i&&!t.right,$=t.sortable&&i&&t.right;return e.createElement(Z,{"data-column-id":t.id,className:"rdt_TableCol",headCell:!0,allowOverflow:t.allowOverflow,button:t.button,compact:t.compact,grow:t.grow,hide:t.hide,maxWidth:t.maxWidth,minWidth:t.minWidth,right:t.right,center:t.center,width:t.width,draggable:t.reorder,isDragging:w(t.id,o),onDragStart:b,onDragOver:m,onDragEnd:h,onDragEnter:f,onDragLeave:x},t.name&&e.createElement(te,{"data-column-id":t.id,"data-sort-id":t.id,role:"columnheader",tabIndex:0,className:"rdt_TableCol_Sortable",onClick:k?void 0:v,onKeyPress:k?void 0:e=>{"Enter"===e.key&&v()},sortActive:!k&&O,disabled:k},!k&&$&&E(),!k&&D&&S(O),"string"==typeof t.name?e.createElement(ne,{title:C?t.name:void 0,ref:R,"data-column-id":t.id},t.name):t.name,!k&&H&&E(),!k&&P&&S(O)))}));const ae=n(P)`
	flex: 0 0 48px;
	justify-content: center;
	align-items: center;
	user-select: none;
	white-space: nowrap;
	font-size: unset;
`;function le({headCell:t=!0,rowData:n,keyField:o,allSelected:a,mergeSelections:l,selectedRows:r,selectableRowsComponent:i,selectableRowsComponentProps:s,selectableRowDisabled:d,onSelectAllRows:c}){const g=r.length>0&&!a,p=d?n.filter((e=>!d(e))):n,u=0===p.length,b=Math.min(n.length,p.length);return e.createElement(ae,{className:"rdt_TableCol",headCell:t,noPadding:!0},e.createElement(I,{name:"select-all-rows",component:i,componentOptions:s,onClick:()=>{c({type:"SELECT_ALL_ROWS",rows:p,rowCount:b,mergeSelections:l,keyField:o})},checked:a,indeterminate:g,disabled:u}))}function re(t=G.AUTO){const n="object"==typeof window,[o,a]=e.useState(!1);return e.useEffect((()=>{if(n)if("auto"!==t)a("rtl"===t);else{const e=!(!window.document||!window.document.createElement),t=document.getElementsByTagName("BODY")[0],n=document.getElementsByTagName("HTML")[0],o="rtl"===t.dir||"rtl"===n.dir;a(e&&o)}}),[t,n]),o}const ie=n.div`
	display: flex;
	align-items: center;
	flex: 1 0 auto;
	height: 100%;
	color: ${({theme:e})=>e.contextMenu.fontColor};
	font-size: ${({theme:e})=>e.contextMenu.fontSize};
	font-weight: 400;
`,se=n.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	flex-wrap: wrap;
`,de=n.div`
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
`;function ce({contextMessage:t,contextActions:n,contextComponent:o,selectedCount:a,direction:l}){const r=re(l),i=a>0;return o?e.createElement(de,{visible:i},e.cloneElement(o,{selectedCount:a})):e.createElement(de,{visible:i,rtl:r},e.createElement(ie,null,((e,t,n)=>{if(0===t)return null;const o=1===t?e.singular:e.plural;return n?`${t} ${e.message||""} ${o}`:`${t} ${o} ${e.message||""}`})(t,a,r)),e.createElement(se,null,n))}const ge=n.div`
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
`,pe=n.div`
	flex: 1 0 auto;
	color: ${({theme:e})=>e.header.fontColor};
	font-size: ${({theme:e})=>e.header.fontSize};
	font-weight: 400;
`,ue=n.div`
	flex: 1 0 auto;
	display: flex;
	align-items: center;
	justify-content: flex-end;

	> * {
		margin-left: 5px;
	}
`,be=({title:t,actions:n=null,contextMessage:o,contextActions:a,contextComponent:l,selectedCount:r,direction:i,showMenu:s=!0})=>e.createElement(ge,{className:"rdt_TableHeader",role:"heading","aria-level":1},e.createElement(pe,null,t),n&&e.createElement(ue,null,n),s&&e.createElement(ce,{contextMessage:o,contextActions:a,contextComponent:l,direction:i,selectedCount:r}));function me(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var a=0;for(o=Object.getOwnPropertySymbols(e);a<o.length;a++)t.indexOf(o[a])<0&&Object.prototype.propertyIsEnumerable.call(e,o[a])&&(n[o[a]]=e[o[a]])}return n}"function"==typeof SuppressedError&&SuppressedError;const he={left:"flex-start",right:"flex-end",center:"center"},we=n.header`
	position: relative;
	display: flex;
	flex: 1 1 auto;
	box-sizing: border-box;
	align-items: center;
	padding: 4px 16px 4px 24px;
	width: 100%;
	justify-content: ${({align:e})=>he[e]};
	flex-wrap: ${({wrapContent:e})=>e?"wrap":"nowrap"};
	${({theme:e})=>e.subHeader.style}
`,fe=t=>{var{align:n="right",wrapContent:o=!0}=t,a=me(t,["align","wrapContent"]);return e.createElement(we,Object.assign({align:n,wrapContent:o},a))},xe=n.div`
	display: flex;
	flex-direction: column;
`,Ce=n.div`
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

	${({theme:e})=>e.responsiveWrapper.style};
`,ye=n.div`
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	${e=>e.theme.progress.style};
`,Re=n.div`
	position: relative;
	width: 100%;
	${({theme:e})=>e.tableWrapper.style};
`,ve=n(P)`
	white-space: nowrap;
	${({theme:e})=>e.expanderCell.style};
`,Se=n.div`
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	${({theme:e})=>e.noData.style};
`,Ee=()=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24"},t.createElement("path",{d:"M7 10l5 5 5-5z"}),t.createElement("path",{d:"M0 0h24v24H0z",fill:"none"})),Oe=n.select`
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
`,ke=n.div`
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
`,Pe=t=>{var{defaultValue:n,onChange:o}=t,a=me(t,["defaultValue","onChange"]);return e.createElement(ke,null,e.createElement(Oe,Object.assign({onChange:o,defaultValue:n},a)),e.createElement(Ee,null))},De={columns:[],data:[],title:"",keyField:"id",selectableRows:!1,selectableRowsHighlight:!1,selectableRowsNoSelectAll:!1,selectableRowSelected:null,selectableRowDisabled:null,selectableRowsComponent:"input",selectableRowsComponentProps:{},selectableRowsVisibleOnly:!1,selectableRowsSingle:!1,clearSelectedRows:!1,expandableRows:!1,expandableRowDisabled:null,expandableRowExpanded:null,expandOnRowClicked:!1,expandableRowsHideExpander:!1,expandOnRowDoubleClicked:!1,expandableInheritConditionalStyles:!1,expandableRowsComponent:function(){return t.createElement("div",null,"To add an expander pass in a component instance via ",t.createElement("strong",null,"expandableRowsComponent"),". You can then access props.data from this component.")},expandableIcon:{collapsed:t.createElement((()=>t.createElement("svg",{fill:"currentColor",height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"},t.createElement("path",{d:"M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"}),t.createElement("path",{d:"M0-.25h24v24H0z",fill:"none"}))),null),expanded:t.createElement((()=>t.createElement("svg",{fill:"currentColor",height:"24",viewBox:"0 0 24 24",width:"24",xmlns:"http://www.w3.org/2000/svg"},t.createElement("path",{d:"M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"}),t.createElement("path",{d:"M0-.75h24v24H0z",fill:"none"}))),null)},expandableRowsComponentProps:{},progressPending:!1,progressComponent:t.createElement("div",{style:{fontSize:"24px",fontWeight:700,padding:"24px"}},"Loading..."),persistTableHead:!1,sortIcon:null,sortFunction:null,sortServer:!1,striped:!1,highlightOnHover:!1,pointerOnHover:!1,noContextMenu:!1,contextMessage:{singular:"item",plural:"items",message:"selected"},actions:null,contextActions:null,contextComponent:null,defaultSortFieldId:null,defaultSortAsc:!0,responsive:!0,noDataComponent:t.createElement("div",{style:{padding:"24px"}},"There are no records to display"),disabled:!1,noTableHead:!1,noHeader:!1,subHeader:!1,subHeaderAlign:V.RIGHT,subHeaderWrap:!0,subHeaderComponent:null,fixedHeader:!1,fixedHeaderScrollHeight:"100vh",pagination:!1,paginationServer:!1,paginationServerOptions:{persistSelectedOnSort:!1,persistSelectedOnPageChange:!1},paginationDefaultPage:1,paginationResetDefaultPage:!1,paginationTotalRows:0,paginationPerPage:10,paginationRowsPerPageOptions:[10,15,20,25,30],paginationComponent:null,paginationComponentOptions:{},paginationIconFirstPage:t.createElement((()=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},t.createElement("path",{d:"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"}),t.createElement("path",{fill:"none",d:"M24 24H0V0h24v24z"}))),null),paginationIconLastPage:t.createElement((()=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},t.createElement("path",{d:"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"}),t.createElement("path",{fill:"none",d:"M0 0h24v24H0V0z"}))),null),paginationIconNext:t.createElement((()=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},t.createElement("path",{d:"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"}),t.createElement("path",{d:"M0 0h24v24H0z",fill:"none"}))),null),paginationIconPrevious:t.createElement((()=>t.createElement("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24","aria-hidden":"true",role:"presentation"},t.createElement("path",{d:"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"}),t.createElement("path",{d:"M0 0h24v24H0z",fill:"none"}))),null),dense:!1,conditionalRowStyles:[],theme:"default",customStyles:{},direction:G.AUTO,onChangePage:u,onChangeRowsPerPage:u,onRowClicked:u,onRowDoubleClicked:u,onRowMouseEnter:u,onRowMouseLeave:u,onRowExpandToggled:u,expandableCloseAllOnExpand:!1,onSelectedRowsChange:u,onSort:u,onColumnOrderChange:u},He={rowsPerPageText:"Rows per page:",rangeSeparatorText:"of",noRowsPerPage:!1,selectAllRowsItem:!1,selectAllRowsItemText:"All"},$e=n.nav`
	display: flex;
	flex: 1 1 auto;
	justify-content: flex-end;
	align-items: center;
	box-sizing: border-box;
	padding-right: 8px;
	padding-left: 8px;
	width: 100%;
	${({theme:e})=>e.pagination.style};
`,Fe=n.button`
	position: relative;
	display: block;
	user-select: none;
	border: none;
	${({theme:e})=>e.pagination.pageButtonsStyle};
	${({isRTL:e})=>e&&"transform: scale(-1, -1)"};
`,je=n.div`
	display: flex;
	align-items: center;
	border-radius: 4px;
	white-space: nowrap;
	${S`
    width: 100%;
    justify-content: space-around;
  `};
`,Ie=n.span`
	flex-shrink: 1;
	user-select: none;
`,Te=n(Ie)`
	margin: 0 24px;
`,Ae=n(Ie)`
	margin: 0 4px;
`;var Le=e.memo((function({rowsPerPage:t,rowCount:n,currentPage:o,direction:a=De.direction,paginationRowsPerPageOptions:l=De.paginationRowsPerPageOptions,paginationIconLastPage:r=De.paginationIconLastPage,paginationIconFirstPage:i=De.paginationIconFirstPage,paginationIconNext:s=De.paginationIconNext,paginationIconPrevious:d=De.paginationIconPrevious,paginationComponentOptions:c=De.paginationComponentOptions,onChangeRowsPerPage:p=De.onChangeRowsPerPage,onChangePage:u=De.onChangePage}){const b=(()=>{const t="object"==typeof window;function n(){return{width:t?window.innerWidth:void 0,height:t?window.innerHeight:void 0}}const[o,a]=e.useState(n);return e.useEffect((()=>{if(!t)return()=>null;function e(){a(n())}return window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)}),[]),o})(),m=re(a),h=b.width&&b.width>599,w=g(n,t),f=o*t,x=f-t+1,C=1===o,y=o===w,R=Object.assign(Object.assign({},He),c),v=o===w?`${x}-${n} ${R.rangeSeparatorText} ${n}`:`${x}-${f} ${R.rangeSeparatorText} ${n}`,S=e.useCallback((()=>u(o-1)),[o,u]),E=e.useCallback((()=>u(o+1)),[o,u]),O=e.useCallback((()=>u(1)),[u]),k=e.useCallback((()=>u(g(n,t))),[u,n,t]),P=e.useCallback((e=>p(Number(e.target.value),o)),[o,p]),D=l.map((t=>e.createElement("option",{key:t,value:t},t)));R.selectAllRowsItem&&D.push(e.createElement("option",{key:-1,value:n},R.selectAllRowsItemText));const H=e.createElement(Pe,{onChange:P,defaultValue:t,"aria-label":R.rowsPerPageText},D);return e.createElement($e,{className:"rdt_Pagination"},!R.noRowsPerPage&&h&&e.createElement(e.Fragment,null,e.createElement(Ae,null,R.rowsPerPageText),H),h&&e.createElement(Te,null,v),e.createElement(je,null,e.createElement(Fe,{id:"pagination-first-page",type:"button","aria-label":"First Page","aria-disabled":C,onClick:O,disabled:C,isRTL:m},i),e.createElement(Fe,{id:"pagination-previous-page",type:"button","aria-label":"Previous Page","aria-disabled":C,onClick:S,disabled:C,isRTL:m},d),!R.noRowsPerPage&&!h&&H,e.createElement(Fe,{id:"pagination-next-page",type:"button","aria-label":"Next Page","aria-disabled":y,onClick:E,disabled:y,isRTL:m},s),e.createElement(Fe,{id:"pagination-last-page",type:"button","aria-label":"Last Page","aria-disabled":y,onClick:k,disabled:y,isRTL:m},r)))}));const Me=(t,n)=>{const o=e.useRef(!0);e.useEffect((()=>{o.current?o.current=!1:t()}),n)};var _e=function(e){return function(e){return!!e&&"object"==typeof e}(e)&&!function(e){var t=Object.prototype.toString.call(e);return"[object RegExp]"===t||"[object Date]"===t||function(e){return e.$$typeof===Ne}(e)}(e)};var Ne="function"==typeof Symbol&&Symbol.for?Symbol.for("react.element"):60103;function ze(e,t){return!1!==t.clone&&t.isMergeableObject(e)?Ue((n=e,Array.isArray(n)?[]:{}),e,t):e;var n}function We(e,t,n){return e.concat(t).map((function(e){return ze(e,n)}))}function Be(e){return Object.keys(e).concat(function(e){return Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(e).filter((function(t){return Object.propertyIsEnumerable.call(e,t)})):[]}(e))}function Ge(e,t){try{return t in e}catch(e){return!1}}function Ve(e,t,n){var o={};return n.isMergeableObject(e)&&Be(e).forEach((function(t){o[t]=ze(e[t],n)})),Be(t).forEach((function(a){(function(e,t){return Ge(e,t)&&!(Object.hasOwnProperty.call(e,t)&&Object.propertyIsEnumerable.call(e,t))})(e,a)||(Ge(e,a)&&n.isMergeableObject(t[a])?o[a]=function(e,t){if(!t.customMerge)return Ue;var n=t.customMerge(e);return"function"==typeof n?n:Ue}(a,n)(e[a],t[a],n):o[a]=ze(t[a],n))})),o}function Ue(e,t,n){(n=n||{}).arrayMerge=n.arrayMerge||We,n.isMergeableObject=n.isMergeableObject||_e,n.cloneUnlessOtherwiseSpecified=ze;var o=Array.isArray(t);return o===Array.isArray(e)?o?n.arrayMerge(e,t,n):Ve(e,t,n):ze(t,n)}Ue.all=function(e,t){if(!Array.isArray(e))throw new Error("first argument should be an array");return e.reduce((function(e,n){return Ue(e,n,t)}),{})};var Ye=Ue;const Ke={text:{primary:"rgba(0, 0, 0, 0.87)",secondary:"rgba(0, 0, 0, 0.54)",disabled:"rgba(0, 0, 0, 0.38)"},background:{default:"#FFFFFF"},context:{background:"#e3f2fd",text:"rgba(0, 0, 0, 0.87)"},divider:{default:"rgba(0,0,0,.12)"},button:{default:"rgba(0,0,0,.54)",focus:"rgba(0,0,0,.12)",hover:"rgba(0,0,0,.12)",disabled:"rgba(0, 0, 0, .18)"},selected:{default:"#e3f2fd",text:"rgba(0, 0, 0, 0.87)"},highlightOnHover:{default:"#EEEEEE",text:"rgba(0, 0, 0, 0.87)"},striped:{default:"#FAFAFA",text:"rgba(0, 0, 0, 0.87)"}},qe={default:Ke,light:Ke,dark:{text:{primary:"#FFFFFF",secondary:"rgba(255, 255, 255, 0.7)",disabled:"rgba(0,0,0,.12)"},background:{default:"#424242"},context:{background:"#E91E63",text:"#FFFFFF"},divider:{default:"rgba(81, 81, 81, 1)"},button:{default:"#FFFFFF",focus:"rgba(255, 255, 255, .54)",hover:"rgba(255, 255, 255, .12)",disabled:"rgba(255, 255, 255, .18)"},selected:{default:"rgba(0, 0, 0, .7)",text:"#FFFFFF"},highlightOnHover:{default:"rgba(0, 0, 0, .7)",text:"#FFFFFF"},striped:{default:"rgba(0, 0, 0, .87)",text:"#FFFFFF"}}};function Je(e="default",t,n="default"){return qe[e]||(qe[e]=Ye(qe[n],t||{})),qe[e]=Ye(qe[e],t||{}),qe[e]}function Qe(t,n,o,a){const[r,i]=e.useState((()=>c(t))),[s,d]=e.useState(""),g=e.useRef("");Me((()=>{i(c(t))}),[t]);const p=e.useCallback((e=>{var t,n,o;const{attributes:a}=e.target,l=null===(t=a.getNamedItem("data-column-id"))||void 0===t?void 0:t.value;l&&(g.current=(null===(o=null===(n=r[h(r,l)])||void 0===n?void 0:n.id)||void 0===o?void 0:o.toString())||"",d(g.current))}),[r]),u=e.useCallback((e=>{var t;const{attributes:o}=e.target,a=null===(t=o.getNamedItem("data-column-id"))||void 0===t?void 0:t.value;if(a&&g.current&&a!==g.current){const e=h(r,g.current),t=h(r,a),o=[...r];o[e]=r[t],o[t]=r[e],i(o),n(o)}}),[n,r]),b=e.useCallback((e=>{e.preventDefault()}),[]),m=e.useCallback((e=>{e.preventDefault()}),[]),w=e.useCallback((e=>{e.preventDefault(),g.current="",d("")}),[]),f=function(e=!1){return e?l.ASC:l.DESC}(a),x=e.useMemo((()=>r[h(r,null==o?void 0:o.toString())]||{}),[o,r]);return{tableColumns:r,draggingColumnId:s,handleDragStart:p,handleDragEnter:u,handleDragOver:b,handleDragLeave:m,handleDragEnd:w,defaultSortDirection:f,defaultSortColumn:x}}var Xe=e.memo((function(t){const{data:n=De.data,columns:o=De.columns,title:s=De.title,actions:d=De.actions,keyField:c=De.keyField,striped:u=De.striped,highlightOnHover:b=De.highlightOnHover,pointerOnHover:h=De.pointerOnHover,dense:w=De.dense,selectableRows:x=De.selectableRows,selectableRowsSingle:y=De.selectableRowsSingle,selectableRowsHighlight:S=De.selectableRowsHighlight,selectableRowsNoSelectAll:E=De.selectableRowsNoSelectAll,selectableRowsVisibleOnly:O=De.selectableRowsVisibleOnly,selectableRowSelected:k=De.selectableRowSelected,selectableRowDisabled:D=De.selectableRowDisabled,selectableRowsComponent:H=De.selectableRowsComponent,selectableRowsComponentProps:$=De.selectableRowsComponentProps,onRowExpandToggled:F=De.onRowExpandToggled,expandableCloseAllOnExpand:j=De.expandableCloseAllOnExpand,onSelectedRowsChange:I=De.onSelectedRowsChange,expandableIcon:T=De.expandableIcon,onChangeRowsPerPage:A=De.onChangeRowsPerPage,onChangePage:L=De.onChangePage,paginationServer:M=De.paginationServer,paginationServerOptions:_=De.paginationServerOptions,paginationTotalRows:N=De.paginationTotalRows,paginationDefaultPage:z=De.paginationDefaultPage,paginationResetDefaultPage:W=De.paginationResetDefaultPage,paginationPerPage:B=De.paginationPerPage,paginationRowsPerPageOptions:G=De.paginationRowsPerPageOptions,paginationIconLastPage:V=De.paginationIconLastPage,paginationIconFirstPage:U=De.paginationIconFirstPage,paginationIconNext:Y=De.paginationIconNext,paginationIconPrevious:K=De.paginationIconPrevious,paginationComponent:q=De.paginationComponent,paginationComponentOptions:Q=De.paginationComponentOptions,responsive:X=De.responsive,progressPending:Z=De.progressPending,progressComponent:ee=De.progressComponent,persistTableHead:te=De.persistTableHead,noDataComponent:ne=De.noDataComponent,disabled:ae=De.disabled,noTableHead:re=De.noTableHead,noHeader:ie=De.noHeader,fixedHeader:se=De.fixedHeader,fixedHeaderScrollHeight:de=De.fixedHeaderScrollHeight,pagination:ce=De.pagination,subHeader:ge=De.subHeader,subHeaderAlign:pe=De.subHeaderAlign,subHeaderWrap:ue=De.subHeaderWrap,subHeaderComponent:me=De.subHeaderComponent,noContextMenu:he=De.noContextMenu,contextMessage:we=De.contextMessage,contextActions:Ee=De.contextActions,contextComponent:Oe=De.contextComponent,expandableRows:ke=De.expandableRows,onRowClicked:Pe=De.onRowClicked,onRowDoubleClicked:He=De.onRowDoubleClicked,onRowMouseEnter:$e=De.onRowMouseEnter,onRowMouseLeave:Fe=De.onRowMouseLeave,sortIcon:je=De.sortIcon,onSort:Ie=De.onSort,sortFunction:Te=De.sortFunction,sortServer:Ae=De.sortServer,expandableRowsComponent:_e=De.expandableRowsComponent,expandableRowsComponentProps:Ne=De.expandableRowsComponentProps,expandableRowDisabled:ze=De.expandableRowDisabled,expandableRowsHideExpander:We=De.expandableRowsHideExpander,expandOnRowClicked:Be=De.expandOnRowClicked,expandOnRowDoubleClicked:Ge=De.expandOnRowDoubleClicked,expandableRowExpanded:Ve=De.expandableRowExpanded,expandableInheritConditionalStyles:Ue=De.expandableInheritConditionalStyles,defaultSortFieldId:Ke=De.defaultSortFieldId,defaultSortAsc:Je=De.defaultSortAsc,clearSelectedRows:Xe=De.clearSelectedRows,conditionalRowStyles:Ze=De.conditionalRowStyles,theme:et=De.theme,customStyles:tt=De.customStyles,direction:nt=De.direction,onColumnOrderChange:ot=De.onColumnOrderChange,className:at}=t,{tableColumns:lt,draggingColumnId:rt,handleDragStart:it,handleDragEnter:st,handleDragOver:dt,handleDragLeave:ct,handleDragEnd:gt,defaultSortDirection:pt,defaultSortColumn:ut}=Qe(o,ot,Ke,Je),[bt,mt]=e.useState(null),[{rowsPerPage:ht,currentPage:wt,selectedRows:ft,allSelected:xt,selectedCount:Ct,selectedColumn:yt,sortDirection:Rt,toggleOnSelectedRowsChange:vt},St]=e.useReducer(f,{allSelected:!1,selectedCount:0,selectedRows:[],selectedColumn:ut,toggleOnSelectedRowsChange:!1,sortDirection:pt,currentPage:z,rowsPerPage:B,selectedRowsFlag:!1,contextMessage:De.contextMessage}),{persistSelectedOnSort:Et=!1,persistSelectedOnPageChange:Ot=!1}=_,kt=!(!M||!Ot&&!Et),Pt=ce&&!Z&&n.length>0,Dt=q||Le,Ht=e.useMemo((()=>((e={},t="default",n="default")=>{const o=qe[t]?t:n;return Ye({table:{style:{color:(a=qe[o]).text.primary,backgroundColor:a.background.default}},tableWrapper:{style:{display:"table"}},responsiveWrapper:{style:{}},header:{style:{fontSize:"22px",color:a.text.primary,backgroundColor:a.background.default,minHeight:"56px",paddingLeft:"16px",paddingRight:"8px"}},subHeader:{style:{backgroundColor:a.background.default,minHeight:"52px"}},head:{style:{color:a.text.primary,fontSize:"12px",fontWeight:500}},headRow:{style:{backgroundColor:a.background.default,minHeight:"52px",borderBottomWidth:"1px",borderBottomColor:a.divider.default,borderBottomStyle:"solid"},denseStyle:{minHeight:"32px"}},headCells:{style:{paddingLeft:"16px",paddingRight:"16px"},draggingStyle:{cursor:"move"}},contextMenu:{style:{backgroundColor:a.context.background,fontSize:"18px",fontWeight:400,color:a.context.text,paddingLeft:"16px",paddingRight:"8px",transform:"translate3d(0, -100%, 0)",transitionDuration:"125ms",transitionTimingFunction:"cubic-bezier(0, 0, 0.2, 1)",willChange:"transform"},activeStyle:{transform:"translate3d(0, 0, 0)"}},cells:{style:{paddingLeft:"16px",paddingRight:"16px",wordBreak:"break-word"},draggingStyle:{}},rows:{style:{fontSize:"13px",fontWeight:400,color:a.text.primary,backgroundColor:a.background.default,minHeight:"48px","&:not(:last-of-type)":{borderBottomStyle:"solid",borderBottomWidth:"1px",borderBottomColor:a.divider.default}},denseStyle:{minHeight:"32px"},selectedHighlightStyle:{"&:nth-of-type(n)":{color:a.selected.text,backgroundColor:a.selected.default,borderBottomColor:a.background.default}},highlightOnHoverStyle:{color:a.highlightOnHover.text,backgroundColor:a.highlightOnHover.default,transitionDuration:"0.15s",transitionProperty:"background-color",borderBottomColor:a.background.default,outlineStyle:"solid",outlineWidth:"1px",outlineColor:a.background.default},stripedStyle:{color:a.striped.text,backgroundColor:a.striped.default}},expanderRow:{style:{color:a.text.primary,backgroundColor:a.background.default}},expanderCell:{style:{flex:"0 0 48px"}},expanderButton:{style:{color:a.button.default,fill:a.button.default,backgroundColor:"transparent",borderRadius:"2px",transition:"0.25s",height:"100%",width:"100%","&:hover:enabled":{cursor:"pointer"},"&:disabled":{color:a.button.disabled},"&:hover:not(:disabled)":{cursor:"pointer",backgroundColor:a.button.hover},"&:focus":{outline:"none",backgroundColor:a.button.focus},svg:{margin:"auto"}}},pagination:{style:{color:a.text.secondary,fontSize:"13px",minHeight:"56px",backgroundColor:a.background.default,borderTopStyle:"solid",borderTopWidth:"1px",borderTopColor:a.divider.default},pageButtonsStyle:{borderRadius:"50%",height:"40px",width:"40px",padding:"8px",margin:"px",cursor:"pointer",transition:"0.4s",color:a.button.default,fill:a.button.default,backgroundColor:"transparent","&:disabled":{cursor:"unset",color:a.button.disabled,fill:a.button.disabled},"&:hover:not(:disabled)":{backgroundColor:a.button.hover},"&:focus":{outline:"none",backgroundColor:a.button.focus}}},noData:{style:{display:"flex",alignItems:"center",justifyContent:"center",color:a.text.primary,backgroundColor:a.background.default}},progress:{style:{display:"flex",alignItems:"center",justifyContent:"center",color:a.text.primary,backgroundColor:a.background.default}}},e);var a})(tt,et)),[tt,et]),$t=e.useMemo((()=>Object.assign({},"auto"!==nt&&{dir:nt})),[nt]),Ft=e.useMemo((()=>{if(Ae)return n;if((null==yt?void 0:yt.sortFunction)&&"function"==typeof yt.sortFunction){const e=yt.sortFunction,t=Rt===l.ASC?e:(t,n)=>-1*e(t,n);return[...n].sort(t)}return function(e,t,n,o){return t?o&&"function"==typeof o?o(e.slice(0),t,n):e.slice(0).sort(((e,o)=>{let a,l;if("string"==typeof t?(a=i(e,t),l=i(o,t)):(a=t(e),l=t(o)),"asc"===n){if(a<l)return-1;if(a>l)return 1}if("desc"===n){if(a>l)return-1;if(a<l)return 1}return 0})):e}(n,null==yt?void 0:yt.selector,Rt,Te)}),["sortServer",yt,Rt,n,Te]),jt=e.useMemo((()=>{const e=Ft.map((e=>{const t=Object.assign({},e);return j?bt&&bt.id==t.id?t.expandFlag=!0:t.expandFlag=!1:t.defaultExpanded||t.expandFlag?t.expandFlag=!0:t.expandFlag=!1,t}));if(ce&&!M){const t=wt*ht,n=t-ht;return e.slice(n,t)}return e}),[wt,ce,M,ht,Ft,bt]),It=e.useCallback((e=>{St(e)}),[]),Tt=e.useCallback((e=>{St(e)}),[]),At=e.useCallback((e=>{St(e)}),[]),Lt=e.useCallback(((e,t)=>Pe(e,t)),[Pe]),Mt=e.useCallback(((e,t)=>He(e,t)),[He]),_t=e.useCallback(((e,t)=>$e(e,t)),[$e]),Nt=e.useCallback(((e,t)=>Fe(e,t)),[Fe]),zt=e.useCallback((e=>St({type:"CHANGE_PAGE",page:e,paginationServer:M,visibleOnly:O,persistSelectedOnPageChange:Ot})),[M,Ot,O]),Wt=e.useCallback((e=>{const t=g(N||jt.length,e),n=p(wt,t);M||zt(n),St({type:"CHANGE_ROWS_PER_PAGE",page:n,rowsPerPage:e})}),[wt,zt,M,N,jt.length]),Bt=e.useCallback(((e,t)=>{F(e,t),mt(t)}),[F]);if(ce&&!M&&Ft.length>0&&0===jt.length){const e=g(Ft.length,ht),t=p(wt,e);zt(t)}Me((()=>{I({allSelected:xt,selectedCount:Ct,selectedRows:ft.slice(0)})}),[vt]),Me((()=>{Ie(yt,Rt,Ft.slice(0))}),[yt,Rt]),Me((()=>{L(wt,N||Ft.length)}),[wt]),Me((()=>{A(ht,wt)}),[ht]),Me((()=>{zt(z)}),[z,W]),Me((()=>{if(ce&&M&&N>0){const e=g(N,ht),t=p(wt,e);wt!==t&&zt(t)}}),[N]),e.useEffect((()=>{St({type:"CLEAR_SELECTED_ROWS",selectedRowsFlag:Xe})}),[y,Xe]),e.useEffect((()=>{if(!k)return;const e=Ft.filter((e=>k(e))),t=y?e.slice(0,1):e;St({type:"SELECT_MULTIPLE_ROWS",keyField:c,selectedRows:t,totalRows:Ft.length,mergeSelections:kt})}),[n,k]);const Gt=O?jt:Ft,Vt=Ot||y||E;return e.createElement(a,{theme:Ht},!ie&&(!!s||!!d)&&e.createElement(be,{title:s,actions:d,showMenu:!he,selectedCount:Ct,direction:nt,contextActions:Ee,contextComponent:Oe,contextMessage:we}),ge&&e.createElement(fe,{align:pe,wrapContent:ue},me),e.createElement(Ce,Object.assign({responsive:X,fixedHeader:se,fixedHeaderScrollHeight:de,className:at},$t),e.createElement(Re,null,Z&&!te&&e.createElement(ye,null,ee),e.createElement(C,{disabled:ae,className:"rdt_Table",role:"table"},!re&&(!!te||Ft.length>0&&!Z)&&e.createElement(R,{className:"rdt_TableHead",role:"rowgroup",fixedHeader:se},e.createElement(v,{className:"rdt_TableHeadRow",role:"row",dense:w},x&&(Vt?e.createElement(P,{style:{flex:"0 0 48px"}}):e.createElement(le,{allSelected:xt,selectedRows:ft,selectableRowsComponent:H,selectableRowsComponentProps:$,selectableRowDisabled:D,rowData:Gt,keyField:c,mergeSelections:kt,onSelectAllRows:Tt})),ke&&!We&&e.createElement(ve,null),lt.map((t=>{const n=t.component?t.component:oe;return e.createElement(n,{key:t.id,column:t,selectedColumn:yt,disabled:Z||0===Ft.length,pagination:ce,paginationServer:M,persistSelectedOnSort:Et,selectableRowsVisibleOnly:O,sortDirection:Rt,sortIcon:je,sortServer:Ae,onSort:It,onDragStart:it,onDragOver:dt,onDragEnd:gt,onDragEnter:st,onDragLeave:ct,draggingColumnId:rt})})))),!Ft.length&&!Z&&e.createElement(Se,null,ne),Z&&te&&e.createElement(ye,null,ee),!Z&&Ft.length>0&&e.createElement(xe,{className:"rdt_TableBody",role:"rowgroup"},jt.map(((t,n)=>{const o=r(t,c),a=function(e=""){return"number"!=typeof e&&(!e||0===e.length)}(o)?n:o,l=m(t,ft,c),i=!!(ke&&Ve&&Ve(t)),s=!!(ke&&ze&&ze(t));return e.createElement(J,{id:a,key:a,keyField:c,"data-row-id":a,columns:lt,row:t,rowCount:Ft.length,rowIndex:n,selectableRows:x,expandableRows:ke,expandableIcon:T,highlightOnHover:b,pointerOnHover:h,dense:w,expandOnRowClicked:Be,expandOnRowDoubleClicked:Ge,expandableRowsComponent:_e,expandableRowsComponentProps:Ne,expandableRowsHideExpander:We,defaultExpanderDisabled:s,defaultExpanded:i,expandableInheritConditionalStyles:Ue,conditionalRowStyles:Ze,selected:l,selectableRowsHighlight:S,selectableRowsComponent:H,selectableRowsComponentProps:$,selectableRowDisabled:D,selectableRowsSingle:y,striped:u,onRowExpandToggled:Bt,expandableCloseAllOnExpand:j,expandableRowFlag:t.expandFlag,onRowClicked:Lt,onRowDoubleClicked:Mt,onRowMouseEnter:_t,onRowMouseLeave:Nt,onSelectedRow:At,draggingColumnId:rt,onDragStart:it,onDragOver:dt,onDragEnd:gt,onDragEnter:st,onDragLeave:ct})})))))),Pt&&e.createElement("div",null,e.createElement(Dt,{onChangePage:zt,onChangeRowsPerPage:Wt,rowCount:N||Ft.length,currentPage:wt,rowsPerPage:ht,direction:nt,paginationRowsPerPageOptions:G,paginationIconLastPage:V,paginationIconFirstPage:U,paginationIconNext:Y,paginationIconPrevious:K,paginationComponentOptions:Q})))}));export{V as Alignment,G as Direction,U as Media,B as STOP_PROP_TAG,Je as createTheme,Xe as default,qe as defaultThemes};
