import {Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DatePipe, NgClass, NgIf} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexModule} from '@angular/flex-layout';
import {
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerInputEvent,
    MatDatepickerToggle
} from '@angular/material/datepicker';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import moment from 'moment/moment';
import {TranslocoPipe, TranslocoService} from '@jsverse/transloco';
import {DateAdapter, provideNativeDateAdapter} from '@angular/material/core';
import {Inputs} from './inputs';


@Component({
    selector: 'inputs',
    imports: [
        DatePipe,
        FormsModule,
        NgIf,
        NgClass,
        FlexModule,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatInput,
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        TranslocoPipe
    ],
    standalone: true,
    templateUrl: './inputs.component.html',
    styleUrl: './inputs.component.scss',
    providers: [
        provideNativeDateAdapter()
    ],
})
export class InputsComponent implements OnInit {
    private readonly transloco = inject(TranslocoService);
    private readonly dateAdapter = inject(DateAdapter<any>);
    private readonly destroyRef = inject(DestroyRef);
    @Input() innerControl?: FormControl;
    @Input() type: Inputs = Inputs.text;
    @Input() value: any;
    @Input() disabled = false;
    @Input() maxlength: any;
    @Input() minlength: any;
    @Input() min?: number;
    @Input() max?: number;
    @Input() required = false;
    @Input() placeholderText?: any;
    @Input() label: string = '';
    @Output() valueChange = new EventEmitter<any>();
    @Output() modelChange = new EventEmitter<any>();
    @Input() fieldErrors: { [key: string]: any } = {};
    @Input() fieldName: string = '';


    @Input() dateMin: string | null = null;
    @Input() dateMax: string | null = null;

    currentLang: string | null = null;

    constructor() {
    }

    ngOnInit() {
        this.currentLang = this.transloco.getActiveLang();
        this.transloco.langChanges$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(lang => {
            this.currentLang = lang;
            this.updateLocale();
        });
    }

    modelChanges(value: any){
        this.valueChange.emit(value);
        this.modelChange.emit(value)
    }

    private updateLocale() {
        if (!this.currentLang) return;
        moment.locale(this.currentLang);
        if (this.currentLang === 'kk') {
            moment.updateLocale('kk', {
                weekdaysMin: ['Жс', 'Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сн'],
            });
        }
        if (this.currentLang === 'ru') {
            moment.updateLocale('ru', {
                weekdaysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
            });
        }
        this.dateAdapter.setLocale(this.currentLang);
    }

    onDateChange(newDate: Date | null) {
        if (newDate) {
            const formatted = moment(newDate).format('YYYY-MM-DD');
            this.valueChange.emit(formatted)
            this.modelChange.emit(formatted);
        } else {
            this.valueChange.emit(null)
            this.modelChange.emit(null);
        }
    }

    onDateChangeFormControl(event: MatDatepickerInputEvent<Date>) {
        const value = event.value;
        if (value) {
            const formatted = moment(value).format('YYYY-MM-DD');

            if (this.innerControl) {
                this.innerControl.setValue(formatted, { emitEvent: true });
            }

            this.valueChange.emit(formatted);
            this.modelChange.emit(formatted);
        } else {
            if (this.innerControl) {
                this.innerControl.setValue(null, { emitEvent: true });
            }

            this.valueChange.emit(null);
            this.modelChange.emit(null);
        }
    }

    preventNegative(event: KeyboardEvent) {
        if (event.key === '-' || event.key === 'e') {
            event.preventDefault();
        }
    }

    get placeholder(): string {
        return this.currentLang === 'kk' ? 'кк.аа.жжжж' : 'дд.мм.гггг';
    }

    onDigitsInput(event: Event) {
        const input = event.target as HTMLInputElement;
        const digitsOnly = input.value.replace(/\D+/g, '');

        if (input.value !== digitsOnly) {
            input.value = digitsOnly;
        }

        this.modelChanges(digitsOnly);
    }

    onNumbersAndLatinInput(event: Event) {
        const input = event.target as HTMLInputElement;
        const numbersAndLatinOnly = input.value.replace(/[^a-z0-9]+/gi, '');

        if (input.value !== numbersAndLatinOnly) {
            input.value = numbersAndLatinOnly;
        }

        this.modelChanges(numbersAndLatinOnly);
    }

    clampNumber(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = parseFloat(input.value);

        if (isNaN(value)) return;

        if (this.max !== undefined && value > this.max) {
            value = this.max;
        }
        if (this.min !== undefined && value < this.min) {
            value = this.min;
        }

        input.value = String(value);
        this.modelChanges(value);
    }


  onDateChangeinnerControl(event: MatDatepickerInputEvent<Date>) {
    const value = event.value;
    if (value) {
      const formatted = moment(value).format('YYYY-MM-DD');


      if (this.innerControl) {
        this.innerControl.setValue(formatted, { emitEvent: true });
      }

      this.valueChange.emit(formatted);
      this.modelChange.emit(formatted);
    } else {
      if (this.innerControl) {
        this.innerControl.setValue(null, { emitEvent: true });
      }

      this.valueChange.emit(null);
      this.modelChange.emit(null);
    }
  }
}
