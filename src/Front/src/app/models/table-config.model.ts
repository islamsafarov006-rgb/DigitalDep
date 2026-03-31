import {TableRowColumn} from './table-column.model';
import {Contexts} from './contexts.model';

export interface TableConfig {
    columns: TableRowColumn[];
    contexts?: Contexts[];
    forHideInputContext?: Contexts[];
    hasDoubleRow?: boolean;
}
