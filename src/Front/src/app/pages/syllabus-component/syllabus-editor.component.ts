import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DocumentService} from '../Services/Document/DocumetService';
import {CourseVolumeService} from '../Services/CourseVolume/CourseVolumeService';
import {ContentService} from '../Services/Content/ContentService';
import {NgForOf} from '@angular/common';


@Component({
  selector: 'app-syllabus-editor',
  templateUrl: './syllabus-editor.component.html',
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  styleUrls: ['./syllabus-editor.component.scss']
})
export class SyllabusEditorComponent implements OnInit {
  syllabusForm: FormGroup;
  weeks = Array.from({ length: 15 }, (_, i) => i + 1); // Массив для 15 недель [cite: 39]

  constructor(
    private fb: FormBuilder,
    private docService: DocumentService,
    private volumeService: CourseVolumeService,
    private contentService: ContentService
  ) {
    // Инициализация формы переменными из документа Political Science [cite: 9, 15, 20]
    this.syllabusForm = this.fb.group({
      common: this.fb.group({
        title: ['Political Science', Validators.required], //
        code: ['MMR 2217', Validators.required], //
        credits: [2, Validators.required], //
        academicYear: ['2025-2026'],
        semester: [2] //
      }),
      volume: this.fb.group({
        lectures: [15], // [cite: 16]
        practice: [15], // [cite: 17]
        siw: [15],      // [cite: 18]
        siwt: [15],     // [cite: 19]
        total: [60]     // [cite: 20]
      }),
      grading: this.fb.group({
        att1: [0.3], //
        att2: [0.3], //
        exam: [0.4], //
        attendancePolicy: ['If the number of absences exceeds 20%, student will be automatically scheduled for a Retake'] // [cite: 51]
      })
    });
  }

  ngOnInit(): void {}

  saveSyllabus() {
    const formData = this.syllabusForm.value;
    console.log('Сохранение шаблона силлабуса:', formData);
    // Здесь вызываются методы сервисов для отправки на бэкенд
  }
}
