import { Component, OnInit, Input, Output, EventEmitter, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { renderAsync } from 'docx-preview';
import { SyllabusProcessService } from '../../../Services/SyllabusTaskService/SyllabusProcessService';
import { DocumentService } from '../../../Services/Document/DocumetService';
import { SyllabusDocument } from '../../../Services/Document/Document';
import { AuthService } from '../../../Services/AuthService/AuthService';

@Component({
  selector: 'app-dean-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dean-review.component.html',
  styleUrls: ['./dean-review.component.scss']
})
export class DeanReviewComponent implements OnInit {
  private camundaService = inject(SyllabusProcessService);
  private documentService = inject(DocumentService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  @Input() task!: any;
  @Output() close = new EventEmitter<any>();

  syllabus = signal<SyllabusDocument | null>(null);
  isLoading = signal(false);
  isSubmitting = signal(false);
  reviewComment = '';
  private resolvedTaskId: string | null = null;
  private variableName = 'deanApproved'; // по умолчанию для деканата

  ngOnInit(): void {
    if (this.task) {
      this.resolvedTaskId = this.task.id;
      // Определяем переменную по taskDefinitionKey если доступен
      if (this.task.taskDefinitionKey === 'Task_HeadOfDepartment') {
        this.variableName = 'headApproved';
      } else {
        this.variableName = 'deanApproved';
      }
      const syllabusId = this.task.variables?.syllabusId?.value || this.task.syllabusId;
      if (syllabusId) this.loadSyllabusData(+syllabusId);
      return;
    }

    const taskId = this.route.snapshot.queryParams['taskId'];
    if (taskId) {
      this.resolvedTaskId = taskId;
    }

    // Определяем имя переменной по текущему маршруту
    const url = this.router.url;
    if (url.includes('/review/head')) {
      this.variableName = 'headApproved';
    } else if (url.includes('/review/dean') || url.includes('/review/deanery')) {
      this.variableName = 'deanApproved';
    }

    console.log('Переменная для Camunda:', this.variableName);

    const idFromRoute = this.route.snapshot.paramMap.get('id');
    console.log('ID из роута:', idFromRoute);
    if (idFromRoute) {
      this.loadSyllabusData(+idFromRoute);
    }
  }

  loadSyllabusData(id: number): void {
    this.isLoading.set(true);
    this.documentService.getById(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (doc: SyllabusDocument) => {
          console.log("Данные получены:", doc);
          this.syllabus.set(doc);
          this.renderDocx(id);
        },
        error: (err: any) => {
          console.error("Ошибка при запросе:", err);
        }
      });
  }

  renderDocx(id: number) {
    this.documentService.exportToWord(id).subscribe({
      next: (blob) => {
        const container = document.getElementById('docx-container');
        if (container) {
          container.innerHTML = '';
          renderAsync(blob, container).then(() => {
            this.isLoading.set(false);
            this.cdr.detectChanges();
          });
        }
      },
      error: () => this.isLoading.set(false)
    });
  }

  submitDecision(approved: boolean): void {
    console.log("Кнопка нажата. Approved:", approved, "ID задачи:", this.resolvedTaskId, "Переменная:", this.variableName);

    if (!approved && !this.reviewComment?.trim()) {
      alert('Пожалуйста, укажите причину отклонения в поле комментария.');
      return;
    }

    if (!this.resolvedTaskId) {
      alert('Ошибка: ID задачи не найден.');
      return;
    }

    this.isSubmitting.set(true);

    const approverName = this.authService.getCurrentUserName();

    this.camundaService.reviewTask(this.resolvedTaskId, this.variableName, approved, approverName, this.reviewComment)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          alert(approved ? 'Силлабус успешно утвержден!' : 'Решение об отклонении отправлено.');
          if (this.task) {
            this.close.emit();
          } else {
            this.router.navigate(['/approval-dashboard']);
          }
        },
        error: (err) => {
          console.error("Ошибка при отправке:", err);
          alert('Ошибка: ' + (err.error?.message || err.message || 'Неизвестная ошибка'));
        }
      });
  }
}
