// @vitest-environment node
import ts from 'typescript';
import { columnProps, dataTableProps } from '../../apps/docs/src/data/props';

const typesFile = decodeURIComponent(new URL('../types.ts', import.meta.url).pathname);
const program = ts.createProgram([typesFile], { strict: true, jsx: ts.JsxEmit.React, skipLibCheck: true });
const checker = program.getTypeChecker();

function propertyNames(typeName: string): string[] {
	const decl = program
		.getSourceFile(typesFile)
		?.statements.find(
			(s): s is ts.TypeAliasDeclaration | ts.InterfaceDeclaration =>
				(ts.isTypeAliasDeclaration(s) || ts.isInterfaceDeclaration(s)) && s.name.text === typeName,
		);
	if (!decl) {
		throw new Error(`${typeName} not found in types.ts`);
	}
	const type = checker.getTypeAtLocation(decl.name);
	// TableProps is an intersection containing unions; collect keys from every member.
	const members = type.isUnion() ? type.types : [type];
	return [...new Set(members.flatMap(t => t.getProperties().map(p => p.name)))].sort();
}

const diff = (a: string[], b: string[]) => a.filter(x => !b.includes(x)).sort();

describe('docs prop catalog matches the types', () => {
	const tableKeys = propertyNames('TableProps');
	const columnKeys = propertyNames('TableColumn');

	test('every DataTable prop is documented, and nothing extra', () => {
		const documented = dataTableProps.filter(p => !p.on).map(p => p.name);
		expect(diff(tableKeys, documented)).toEqual([]);
		expect(diff(documented, tableKeys)).toEqual([]);
	});

	test('every TableColumn field is documented, and nothing extra', () => {
		const documented = columnProps.map(p => p.name);
		expect(diff(columnKeys, documented)).toEqual([]);
		expect(diff(documented, columnKeys)).toEqual([]);
	});

	test('column.* entries on feature pages name real TableColumn fields', () => {
		const featureEntries = dataTableProps.filter(p => p.on === 'column').map(p => p.name.replace(/^column\./, ''));
		expect(diff(featureEntries, columnKeys)).toEqual([]);
	});
});
