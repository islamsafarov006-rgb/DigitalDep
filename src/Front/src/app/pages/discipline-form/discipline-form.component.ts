import { Component, EventEmitter, Output, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators, FormControl, AbstractControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableConfig } from '../../models/table-config.model';
import { TableColumnTypes } from '../../shared-new/tables/table-column-types';
import { InputsComponent } from '../../shared-new/inputs/inputs.component';
import { SelectsComponent } from '../../shared-new/selects/selects.component';
import { TablesComponent } from '../../shared-new/tables/tables.component';
import { Inputs } from '../../shared-new/inputs/inputs';
import { Selects } from '../../shared-new/selects/selects';
import { DocumentService } from '../../Services/Document/DocumetService';
import { DocumentStatus } from '../../Services/Document/Document';
import {Router} from '@angular/router';

@Component({
  selector: 'app-discipline-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputsComponent,
    SelectsComponent,
    TablesComponent
  ],
  templateUrl: './discipline-form.component.html',
  styleUrls: ['./discipline-form.component.scss']
})
export class DisciplineFormComponent implements OnInit {
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly docService = inject(DocumentService);
  private router = inject(Router);
  public readonly InputTypes = Inputs;
  public readonly SelectTypes = Selects;

  disciplineForm!: FormGroup;

  // Храним данные для таблицы в обычном свойстве, чтобы ссылка не менялась постоянно
  public tableDataSource: any[] = [];

  public syllabusTableConfig: TableConfig = {
    columns: [
      { key: 'index', title: '№', type: TableColumnTypes.index, width: '50px' },
      { key: 'lectureTopic', title: 'Лекционные занятия', type: TableColumnTypes.inputText, width: '25%' },
      { key: 'practiceTopic', title: 'Практика / Лабораторные', type: TableColumnTypes.inputText, width: '25%' },
      { key: 'srspTopic', title: 'СРСП', type: TableColumnTypes.inputText, width: '20%' },
      { key: 'spzTopic', title: 'СПЗ', type: TableColumnTypes.inputText, width: '20%' }
    ]
  };

  ngOnInit() {
    this.initForm();
    this.generateWeeks(15);
  }

  private initForm() {
    this.disciplineForm = this.fb.group({
      disciplineName: ['', [Validators.required, Validators.minLength(2)]],
      disciplineId: [null],
      academicYear: [2026, [Validators.required, Validators.min(2020)]],
      semester: [1, Validators.required],
      weeklyTopics: this.fb.array([])
    });
  }

  private generateWeeks(count: number) {
    const weeks = this.disciplineForm.get('weeklyTopics') as FormArray;
    for (let i = 1; i <= count; i++) {
      weeks.push(this.fb.group({
        weekNumber: [i],
        lectureTopic: [''],
        practiceTopic: [''],
        srspTopic: [''],
        spzTopic: ['']
      }));
    }
    this.tableDataSource = weeks.getRawValue();
  }

  onTableDataChange(event: any) {
    const { event: newValue, key, index } = event;
    const formArray = this.disciplineForm.get('weeklyTopics') as FormArray;
    const control = formArray.at(index).get(key);

    if (control && control.value !== newValue) {
      control.setValue(newValue, { emitEvent: false });
      this.tableDataSource[index][key] = newValue;
    }
  }

  asFormControl(control: AbstractControl | null): FormControl {
    return control as FormControl;
  }

  onSubmit() {
    if (this.disciplineForm.invalid) {
      this.disciplineForm.markAllAsTouched();
      return;
    }

    const formValue = this.disciplineForm.value;

    const documentPayload: any = {
      discipline: {
        id: formValue.disciplineId || null,
        name: formValue.disciplineName
      },
      academicYear: formValue.academicYear.toString(),
      semester: formValue.semester,
      status: DocumentStatus.DRAFT,
      weeklyTopics: formValue.weeklyTopics,
      goals: ''
    };

    this.docService.saveDiscipline(documentPayload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.save.emit(response);
        },
        error: (err) => console.error('Ошибка при сохранении:', err)
      });
  }

  goBack() { this.router.navigate(['/syllabus']); }

}
