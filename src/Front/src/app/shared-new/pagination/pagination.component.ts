import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {PaginationConfig} from '../../models/pagination-config';

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

