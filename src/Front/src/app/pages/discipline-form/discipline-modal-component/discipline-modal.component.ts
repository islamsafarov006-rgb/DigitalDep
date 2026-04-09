import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TablesComponent } from '../../../shared-new/tables/tables.component';
import { SyllabusDocument } from '../../../Services/Document/Document';
import { DocumentService } from '../../../Services/Document/DocumetService';
import { TableConfig } from '../../../models/table-config.model';
import { TableColumnTypes } from '../../../shared-new/tables/table-column-types';

@Component({
  selector: 'app-discipline-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TablesComponent, MatDialogModule],
  templateUrl: './discipline-modal.component.html',
  styleUrls: ['./discipline-modal.component.scss']
})
export class DisciplineModalComponent implements OnInit {
  // 1. Внедряем инструменты диалога
  private dialogRef = inject(MatDialogRef<DisciplineModalComponent>);
  public data = inject(MAT_DIALOG_DATA); // Сюда приходят данные из editor.component

  private fb = inject(FormBuilder);
  private docService = inject(DocumentService);

  // 2. Используем данные из data.syllabusData (согласно вашему вызову в редакторе)
  syllabusData: SyllabusDocument = this.data.syllabusData;

  isEditMode = false;
  editForm!: FormGroup;
  tableDataSource: any[] = [];

  public tableConfig: TableConfig = {
    columns: [
      { key: 'weekNumber', title: 'Неделя', type: TableColumnTypes.index, width: '70px' },
      { key: 'lectureTopic', title: 'Лекция', type: TableColumnTypes.inputText, width: '30%' },
      { key: 'practiceTopic', title: 'Практика', type: TableColumnTypes.inputText, width: '30%' },
      { key: 'srspTopic', title: 'СРСП', type: TableColumnTypes.inputText, width: '20%' },
      { key: 'spzTopic', title: 'СПЗ', type: TableColumnTypes.inputText, width: '15%' }
    ]
  };

  ngOnInit() {
    // Проверка на undefined перед инициализацией
    if (this.syllabusData) {
      this.initForm();
      this.loadData();
    }
  }

  private initForm() {
    this.editForm = this.fb.group({
      weeklyTopics: this.fb.array([])
    });
  }

  private loadData() {
    const topicsArray = this.editForm.get('weeklyTopics') as FormArray;
    topicsArray.clear();

    // Безопасное чтение weeklyTopics
    const topics = this.syllabusData?.weeklyTopics?.length
      ? this.syllabusData.weeklyTopics
      : Array.from({ length: 15 }, (_, i) => ({ weekNumber: i + 1 }));

    topics.forEach((topic: any) => {
      topicsArray.push(this.fb.group({
        weekNumber: [topic.weekNumber],
        lectureTopic: [topic.lectureTopic || ''],
        practiceTopic: [topic.practiceTopic || ''],
        srspTopic: [topic.srspTopic || ''],
        spzTopic: [topic.spzTopic || '']
      }));
    });

    this.tableDataSource = topicsArray.getRawValue();
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.loadData();
    }
  }

  onDataChange(event: any) {
    const { event: val, key, index } = event;
    const formArray = this.editForm.get('weeklyTopics') as FormArray;
    if (formArray.at(index)) {
      formArray.at(index).get(key)?.setValue(val, { emitEvent: false });
      this.tableDataSource[index][key] = val;
    }
  }

  saveChanges() {
    if (!this.syllabusData?.id) return;

    const updatedTopics = this.editForm.get('weeklyTopics')?.value;

    this.docService.updateWeeklyTopics(this.syllabusData.id, updatedTopics).subscribe({
      next: (res) => {
        this.isEditMode = false;
        // 3. Вместо emit() используем close(), передавая результат назад
        this.dialogRef.close(res);
      },
      error: (err) => console.error('Ошибка при обновлении тем', err)
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
