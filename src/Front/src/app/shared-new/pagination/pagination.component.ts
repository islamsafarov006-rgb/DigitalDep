import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PaginationConfig} from '../../core/models/pagination-config';
import {MatPaginator} from '@angular/material/paginator';

@Component({
    selector: 'pagination',
    imports: [
        MatPaginator
    ],
    standalone: true,
    templateUrl: './pagination.component.html',
    styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
    @Input({ required: true }) config!: PaginationConfig;
    @Output() page = new EventEmitter<any>();
}
