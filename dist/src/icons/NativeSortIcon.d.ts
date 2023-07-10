import React from 'react';
import { SortOrder } from '../DataTable/types';
interface NativeSortIconProps {
    sortActive: boolean;
    sortDirection: SortOrder;
}
declare const NativeSortIcon: React.FC<NativeSortIconProps>;
export default NativeSortIcon;
