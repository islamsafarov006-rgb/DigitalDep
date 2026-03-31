import {ButtonConfig} from './button-config.model';
import {TableColumnTypes} from '../../shared-new/tables/table-column-types';
import {SelectTableConfig} from './select-table-config.model';

export interface TableRowColumn {
    key: string;
    title: string;
    type?: TableColumnTypes;
    width?: string;
    filedErrors?: any;
    minlength?: any;
    maxlength?: any;
    min?: number;
    max?: number;
    cssClass?: string;
    selectConfig?: SelectTableConfig;
    codeText?: any[];
    multilingual?: {
        kk?: string;
        ru?: string;
    };
    actions?: ButtonConfig[];
    actionContexts?: any[];
    subColumns?: TableRowColumn[];
    objectColumn?: TableRowColumn;
    rowspan?: any;
    colspan?: any;
    currencySymbol?: string;
    arrayName?: string;
}
