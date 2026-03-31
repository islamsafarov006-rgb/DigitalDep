import {Directive} from '@angular/core';
import {Icons} from '../icon/icons';
import {ButtonsConstants} from '../buttons/buttons';
import {Inputs} from '../inputs/inputs';
import {Selects} from '../selects/selects';
import {TableColumnTypes} from '../tables/table-column-types';


@Directive({
    standalone: true,
})
export abstract class CommonComponent {
    protected readonly Icons = Icons;
    protected readonly Buttons = ButtonsConstants.Buttons;
    protected readonly TableColumnTypes = TableColumnTypes
    protected readonly Inputs = Inputs
    protected readonly Selects = Selects


    clickButtons(type: keyof this) {
        const fn = this[type];
        if (typeof fn === 'function') {
            fn.call(this);
        }
    }

}
