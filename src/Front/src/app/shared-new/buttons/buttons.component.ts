import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FlexModule} from '@angular/flex-layout';
import {TranslocoPipe} from '@jsverse/transloco';
import {IconComponent} from '../icon/icon.component';
import {CommonComponent} from '../common/common.component';
import {NgForOf, NgIf} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';
import {ButtonConfig} from '../../models/button-config.model';

@Component({
    selector: 'buttons',
    imports: [
        FlexModule,
        TranslocoPipe,
        IconComponent,
        NgForOf,
        NgIf,
        MatTooltip
    ],
    standalone: true,
    templateUrl: './buttons.component.html',
    styleUrl: './buttons.component.scss'
})
export class ButtonsComponent extends CommonComponent {
    @Input() type: string = 'simple-buttons';
    @Input({ required: true }) configs!: ButtonConfig[];
    @Input() contexts: any[] = [];
    @Input() disabledContexts: any[] = [];
    @Output() action  = new EventEmitter<any>();

    iconColor = '';
    isClick = false;

    visibility(clickType: string): boolean {
        const context = this.contexts.find(ctx => ctx.key === clickType);
        if (!context) return true;

        if (typeof context.visible === 'function') {
            const value = typeof context.value === 'function' ? context.value() : context.value;
            return context.visible(value);
        }

        return true;
    }

    disabled(clickType: string): boolean {
        const context = this.disabledContexts.find(ctx => ctx.key === clickType);
        if (!context) return false;

        if (typeof context.visible === 'function') {
            const value = typeof context.value === 'function' ? context.value() : context.value;
            return context.visible(value);
        }

        return false;
    }

    toggleClick(){
        this.isClick = !this.isClick;
    }

}
