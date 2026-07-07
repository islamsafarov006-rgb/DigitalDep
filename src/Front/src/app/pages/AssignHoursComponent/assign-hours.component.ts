import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/AuthService/AuthService';
import { DocumentService } from '../../Services/Document/DocumetService';
import {DisciplineService} from '../../Services/DisciplineService';

@Component({
  selector: 'app-assign-hours',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assign-hours.component.html',
  styleUrls: ['./assign-hours.component.scss']
})
export class AssignHoursComponent implements OnInit {
  assignForm: FormGroup;
  teachers: any[] = [];
  disciplines: any[] = [];

  academicYears: string[] = ['2025-2026', '2026-2027', '2027-2028'];
  courses: number[] = [1, 2, 3, 4];
  semesters: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private documentService: DocumentService,
    private disciplineService: DisciplineService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.assignForm = this.fb.group({
      teacherId: [null, Validators.required],
      disciplineId: [null, Validators.required],
      documentTitle: [''],
      academicYear: ['', Validators.required],
      course: [null, Validators.required],
      semester: [null, Validators.required],
      lectures: [0, [Validators.required, Validators.min(0)]],
      practice: [0, [Validators.required, Validators.min(0)]],
      siw: [0, [Validators.required, Validators.min(0)]],
      siwt: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.authService.getAllTeachers().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.teachers = data.filter(user =>
            user.role?.toString().trim().toUpperCase().includes('TEACHER')
          );
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error loading teachers:', err)
    });

    this.disciplineService.getAllDisciplines().subscribe({
      next: (data) => {
        this.disciplines = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading disciplines:', err)
    });
  }

  onDisciplineChange(): void {
    const selectedId = this.assignForm.get('disciplineId')?.value;
    const selectedDisc = this.disciplines.find(d => d.id === selectedId);

    if (selectedDisc) {
      // Подставляем все данные из базы напрямую в поля формы
      this.assignForm.patchValue({
        documentTitle: selectedDisc.name,
        lectures: selectedDisc.defaultLectures ?? 0,
        practice: selectedDisc.defaultPractice ?? 0,
        siw: selectedDisc.defaultSiw ?? 0,
        siwt: selectedDisc.defaultSiwt ?? 0,
        course: selectedDisc.recommendedCourse ?? null,
        semester: selectedDisc.recommendedSemester ?? null
      });
      this.cdr.detectChanges();
    }
  }

  get totalHours(): number {
    const values = this.assignForm.value;
    return (values.lectures || 0) + (values.practice || 0) + (values.siw || 0) + (values.siwt || 0);
  }

  resetForm(): void {
    this.assignForm.reset({
      teacherId: null,
      disciplineId: null,
      documentTitle: '',
      academicYear: '',
      course: null,
      semester: null,
      lectures: 0,
      practice: 0,
      siw: 0,
      siwt: 0
    });
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (this.assignForm.valid) {
      this.errorMessage = '';
      this.successMessage = '';
      console.log('Данные формы, отправляемые на бэкенд:', this.assignForm.value);
      this.documentService.assignCourse(this.assignForm.value).subscribe({
        next: (response) => {
          const selectedTeacher = this.teachers.find(t => t.id === this.assignForm.value.teacherId);
          const teacherName = selectedTeacher ? selectedTeacher.fullName : 'преподавателю';

          this.successMessage = `Дисциплина «${this.assignForm.value.documentTitle}» успешно назначена преподавателю ${teacherName}!`;

          this.resetForm();

          setTimeout(() => this.router.navigate(['/main-page']), 3500);
        },
        error: (err) => {
          this.errorMessage = err.error || 'Произошла ошибка при распределении нагрузки на бэкенде.';
          console.error(err);
        }
      });
    }
  }
}
