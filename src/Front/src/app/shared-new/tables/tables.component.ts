import {Component, DestroyRef, EventEmitter, inject, Input, OnChanges, Output} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {DatePipe, DecimalPipe, NgClass, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';
import {TranslocoPipe, TranslocoService} from '@jsverse/transloco';
import {TableConfig} from '../../core/models/table-config.model';
import {TableRowColumn} from '../../core/models/table-column.model';
import {ButtonsComponent} from '../buttons/buttons.component';
import {InputsComponent} from '../inputs/inputs.component';
import {CommonComponent} from '../common/common.component';
import {IconComponent} from '../icon/icon.component';
import {SelectsComponent} from "../selects/selects.component";
import {ButtonConfig} from '../../core/models/button-config.model';

@Component({
    selector: 'tables',
    standalone: true,
    imports: [
        MatTableModule,
        NgForOf,
        TranslocoPipe,
        NgIf,
        NgClass,
        ButtonsComponent,
        DatePipe,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        InputsComponent,
        IconComponent,
        SelectsComponent,
        DecimalPipe
    ],
    templateUrl: './tables.component.html',
    styleUrl: './tables.component.scss'
})
export class TablesComponent extends CommonComponent implements OnChanges {
    private readonly translocoService = inject(TranslocoService);
    private readonly destroyRef = inject(DestroyRef);
    @Input({ required: true }) config!: TableConfig;
    @Input({ required: true }) data!: any[];
    @Input() type: string = 'gray';
    @Input() customDbClick: boolean = false;

    @Input() childrenName: string = '';
    @Input() isManipulateButtons = false;
    @Input() isEditingRow: any;
    @Output() selectRow = new EventEmitter<any>();
    @Output() doubleClick = new EventEmitter<any>();
    @Output() tableActionClick = new EventEmitter<any>();
    @Output() changeData = new EventEmitter<any>();

    columns: TableRowColumn[] = [];
    dataSource = new MatTableDataSource<any>([]);
    selectedRow: any | null = null;
    currentLang: string = 'ru';

    flatColumns: TableRowColumn[] = [];

    tableManipulationConfig: ButtonConfig[] = [this.Buttons.expandAllSimple, this.Buttons.collapseAllSimple];

    constructor() {
        super();
        this.translocoService.langChanges$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(lang => {
            this.currentLang = lang;
            this.updateMultilingualColumns();
        });
    }

    ngOnChanges() {
        this.initializeTable();
    }

    private initializeTable() {
        if (!this.config?.columns) return;

        this.columns = this.config.columns;
        this.dataSource.data = this.data || [];

        this.flatColumns = [];
        for (const col of this.columns) {
            if (col.subColumns?.length) {
                this.flatColumns.push(col);
                col.subColumns.forEach(sub => {
                    this.flatColumns.push(sub);
                });
            } else {
                this.flatColumns.push(col);
            }
        }

        this.currentLang = this.translocoService.getActiveLang();
    }

    private updateMultilingualColumns() {
        this.dataSource.data = [...this.dataSource.data];
    }

    selectRowShow(row: any) {
        this.selectedRow = row;
        this.selectRow.emit(row);
    }

    unSelectRowShow() {
        this.selectedRow = null;
        this.selectRow.emit(null);
    }

    getColumnTitle(column: TableRowColumn): string {
        return column.title;
    }

    getCellValue(element: any, column: TableRowColumn, rowIndex: number): any {
        if (column.type === 'index') {
            return rowIndex + 1;
        }

        const lang = this.currentLang as keyof typeof column.multilingual;

        if (column.objectColumn) {
            const { key, multilingual } = column.objectColumn;

            const multilingualKey = multilingual?.[this.currentLang as keyof typeof multilingual];
            const objectKey = multilingualKey ?? key;

            return element[column.key]?.[objectKey];
        }

        const multilingualKey = column.multilingual?.[lang];
        const finalKey = multilingualKey ?? column.key;

        return element?.[finalKey];
    }

    catchChange(event: Event, key: string, row: any, index: any){
        this.changeData.emit({event, key, row, index});
    }

    visibility(columnKey: string): boolean {
        if (this.config.contexts) {
            const context = this.config.contexts.find(ctx => ctx.key === columnKey);
            if (!context) return true;

            if (typeof context.visible === 'function') {
                const value = typeof context.value === 'function' ? context.value() : context.value;
                return context.visible(value);
            }
        }

        return true;
    }

    getText(columnKey: string, element: any): boolean {
        if (this.config.forHideInputContext) {
            const context = this.config.forHideInputContext.find(ctx => ctx.key === columnKey);
            if (!context) return true;

            if (typeof context.visible === 'function') {
                const value = typeof context.value === 'function' ? context.value() : context.value;
                if (value) return context.visible(element, value);
                else if (!value) return context.visible(element);
                return context.visible(value);
            }
        }

        return true;
    }

    findCodeText(column: any, code: any) {
        return column.codeText.find((v: any) => v.code === code)?.text || '';
    }

    get displayedColumns(): string[] {
        return this.columns
            .filter(col => this.visibility(col.key))
            .map(col => col.key);
    }

    get displayedSubColumns(): string[] {
        let subColumns: any[] = [];

        this.columns.forEach(value => {
            if (value.subColumns && value.subColumns.length > 0) {
                subColumns = value.subColumns
                    .filter(col => this.visibility(col.key))
                    .map(col => col.key);
            }
        })

        return subColumns;
    }


    get displayedTdColumns(): string[] {
        let notParent = [];

        for (const col of this.columns) {
            if (col.subColumns?.length) {
                col.subColumns.forEach(sub => {
                    notParent.push(sub);
                });
            } else {
                notParent.push(col);
            }
        }

        return notParent
            .filter(col => this.visibility(col.key))
            .map(col => col.key);
    }

    toggleChilds(row: any) {
        const data = [...this.dataSource.data];
        const rowIndex = data.findIndex(r => r.id === row.id);

        if (row.openChildren) {
            row.openChildren = false;

            const removeChildrenRecursively = (parent: any) => {
                if (!parent[this.childrenName]?.length) return;
                parent[this.childrenName].forEach((ch: any) => {
                    const idx = data.findIndex(item => item.id === ch.id);
                    if (idx !== -1) data.splice(idx, 1);

                    removeChildrenRecursively(ch);
                });
            };

            removeChildrenRecursively(row);
            this.dataSource.data = [...data];
            return;
        }

        row.openChildren = true;

        if (row[this.childrenName]?.length > 0) {
            const childrenWithFlag = row[this.childrenName].map((ch: any) => ({
                ...ch,
                isChildren: true,
                level: (row.level ?? 0) + 1,
            }));

            data.splice(rowIndex + 1, 0, ...childrenWithFlag);
        }

        this.dataSource.data = [...data];
    }


    getRowIndex(row: any): string {
        const data = this.dataSource.data;
        const rowIdx = data.indexOf(row);

        const rowLevel = row.level ?? 0;

        if (!row.isChildren || rowLevel === 0) {
            const parentList = data.filter(r => (r.level ?? 0) === 0);
            return (parentList.indexOf(row) + 1).toString();
        }

        const chain: any[] = [];
        let currentLevel = rowLevel;

        for (let i = rowIdx - 1; i >= 0; i--) {
            const r = data[i];
            const rLevel = r.level ?? 0;

            if (rLevel < currentLevel) {
                chain.unshift(r);
                currentLevel = rLevel;

                if (currentLevel === 0) break;
            }
        }

        if (chain.length === 0) return '?';

        chain.push(row);

        const parts = chain.map((item, index) => {
            const itemLevel = item.level ?? 0;

            if (itemLevel === 0) {
                const parentList = data.filter(r => (r.level ?? 0) === 0);
                return parentList.indexOf(item) + 1;
            }

            const parent = chain[index - 1];
            if (!parent || !parent[this.childrenName]) return 1;

            const siblings = parent[this.childrenName];
            const idx = siblings.findIndex((ch: any) => ch.id === item.id);
            return idx >= 0 ? idx + 1 : 1;
        });

        return parts.join('.');
    }

    orgIcons(node: string) {
        switch (node) {
            case 'ORGANIZATION':
                return this.Icons.organization
            case 'DEPARTMENT':
                return this.Icons.department
            default:
                return this.Icons.person
        }
    }

    filterActions(element: any, column: any){
        let buttonConfig = [];

        if (column.actionContexts && column.actionContexts.length > 0) {

            column.actions.forEach((action: any) => {
                if (this.checkContextAction(element, column.actionContexts, action.clickType)) {
                    buttonConfig.push(action);
                }
            })
        } else {
            buttonConfig = column.actions;
        }

        return buttonConfig;
    }

    checkContextAction(element: any, actionContexts: any, clickType: any){
        const context = actionContexts.find((ctx: any) => ctx.key === clickType);
        if (!context) return true;

        if (typeof context.visible === 'function') {
            const value = typeof context.value === 'function' ? context.value() : context.value;
            if (!value) return context.visible(element);
            return context.visible(value);
        }
    }

    getEmployeesArrayValue(row: any, columnIndex: number, arrayName: string){
        let employee: any = {}

        if (row[arrayName] && row[arrayName].length > 0) {
            employee = row[arrayName][columnIndex - 1];
            if (employee?.lastname && employee?.firstname) {
                return employee.lastname + ' ' +  employee.firstname;
            }
        }

        return '';
    }

    expandAllSimple() {
        const result: any[] = [];

        const expandRecursively = (row: any, level = 0) => {
            row.openChildren = true;
            row.level = level;

            result.push(row);

            if (!row[this.childrenName]?.length) return;

            row[this.childrenName].forEach((ch: any) => {
                expandRecursively(
                    {
                        ...ch,
                        isChildren: true
                    },
                    level + 1
                );
            });
        };

        const rootRows = this.dataSource.data.filter(r => !r.isChildren);
        rootRows.forEach(r => expandRecursively(r));

        this.dataSource.data = result;
    }

    collapseAllSimple() {
        let rootRows = this.dataSource.data.filter(r => !r.isChildren);

        const resetFlags = (row: any) => {
            row.openChildren = false;
            row[this.childrenName]?.forEach((ch: any) => resetFlags(ch));
        };

        rootRows.forEach(r => resetFlags(r));

        this.dataSource.data = [...rootRows];
    }

    doubleClickChange(row: any){
        if (this.customDbClick) {
            this.selectedRow = row;
            this.doubleClick.emit(row);
        } else {
            this.unSelectRowShow()
        }
    }
}
