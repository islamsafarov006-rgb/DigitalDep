import {Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {MatSelectSearchComponent} from 'ngx-mat-select-search';
import {TranslocoPipe} from '@jsverse/transloco';
import {Selects} from './selects';
import {LangFieldPipe} from '../../shared/pipes/langField.pipe';
import {ImportantStyleDirective} from '../../core/directive/important-style.directive';

@Component({
    selector: 'selects',
    standalone: true,
    imports: [
        MatFormField,
        MatLabel,
        MatOption,
        MatSelect,
        MatSelectSearchComponent,
        NgForOf,
        NgIf,
        ReactiveFormsModule,
        FormsModule,
        TranslocoPipe,
        NgClass,
        LangFieldPipe,
        ImportantStyleDirective,
    ],
    templateUrl: './selects.component.html',
    styleUrls: ['./selects.component.scss']
})
export class SelectsComponent implements OnChanges, OnInit {
    private readonly destroyRef = inject(DestroyRef);
    @Input() label = '';
    @Input() type: Selects = Selects.select;
    @Input() items: any[] = [];
    @Input() displayKey = '';
    @Input() valueKey = '';
    @Input() disabled = false;
    @Input() showNotSelected = true;
    @Input() formControl?: FormControl;
    @Input() fieldErrors: { [key: string]: any } = {};
    @Input() fieldName: string = '';
    @Input() langConfig: any;
    @Input() importantStyles: { [key: string]: string } = {};

    @Input() modelValue: any;
    @Output() modelValueChange = new EventEmitter<any>();
    @Output() selectionChange = new EventEmitter<any>();

    filterCtrl = new FormControl('');
    filteredItems: any[] = [];

    ngOnInit() {
        this.filterCtrl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(value => {
            this.applyFilter(value);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['items']) {
            this.filteredItems = [...(this.items ?? [])];
        }
    }

    applyFilter(search: any) {
        const searchValue = (search || '').toLowerCase();
        if (!searchValue) {
            this.filteredItems = [...(this.items ?? [])];
        } else {
            this.filteredItems = this.items.filter(item =>
                item[this.displayKey]?.toLowerCase().includes(searchValue)
            );
        }
    }

    onSelectionChange(value: any) {
        this.modelValueChange.emit(value);
        this.selectionChange.emit(value);
    }

    checkForMatFiled(type: string): boolean {
        let typeArr = type.split('-');

        for (let value of typeArr) {
            if (value === 'mat') {
                return true;
            }
        }
        return false;
    }
}
