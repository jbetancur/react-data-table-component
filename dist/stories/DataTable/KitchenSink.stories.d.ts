import { Meta, Story } from '@storybook/react/types-6-0';
import { TableProps } from '../../src/index';
interface Row {
    title: string;
    director: string;
    year: string;
}
interface TablePropsExtended extends TableProps<Row> {
    selectableRowsRadio: boolean;
}
export declare const KitchenSinkTS: Story<TablePropsExtended>;
declare const _default: Meta<import("@storybook/react/types-6-0").Args>;
export default _default;
