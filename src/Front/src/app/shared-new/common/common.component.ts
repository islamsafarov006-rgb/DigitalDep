import {Directive} from '@angular/core';
import {Icons} from '../icon/icons';
import {ButtonsConstants} from '../buttons/buttons';
import {Inputs} from '../inputs/inputs';
import {Selects} from '../selects/selects';
import {TableColumnTypes} from '../tables/table-column-types';
import {ModalType} from '../dynamic-modal/modal-type';
import {ApprovalStatus} from '../../core/constants/approval-status.constants';
import {ApprovalRole} from '../../core/constants/approval-role.constants';
import {ProcessStatus} from '../../core/constants/process-status.constants';

@Directive({
    standalone: true,
})
export abstract class CommonComponent {
    protected readonly Icons = Icons;
    protected readonly Buttons = ButtonsConstants.Buttons;
    protected readonly TableColumnTypes = TableColumnTypes
    protected readonly Inputs = Inputs
    protected readonly Selects = Selects
    protected readonly ModalTypes = ModalType;
    protected readonly ApprovalStatus = ApprovalStatus
    protected readonly ApprovalRole = ApprovalRole
    protected readonly ProcessStatus = ProcessStatus

    clickButtons(type: keyof this) {
        const fn = this[type];
        if (typeof fn === 'function') {
            fn.call(this);
        }
    }

}
