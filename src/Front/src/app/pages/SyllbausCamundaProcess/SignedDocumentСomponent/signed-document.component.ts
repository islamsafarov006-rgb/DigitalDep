import { Component, OnInit, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SyllabusProcessService } from '../../../Services/SyllabusTaskService/SyllabusProcessService';

@Component({
  selector: 'app-signed-document',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signed-document.component.html',
  styleUrls: ['./signed-document.component.scss']
})
export class SignedDocumentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private camundaService = inject(SyllabusProcessService);

  // Поддержка открытия внутри общего дашборда задач
  @Input() task!: any;
  @Output() close = new EventEmitter<any>();

  documentId!: number;
  selectedFile: File | null = null;
  uploadSuccess = false;
  isSubmitting = signal(false);

  private resolvedTaskId: string | null = null;

  ngOnInit() {
    // Вариант 1: Компонент открыт через Camunda Дашборд (вкладка задач инициатора)
    if (this.task) {
      this.resolvedTaskId = this.task.id;
      const syllabusId = this.task.variables?.syllabusId?.value || this.task.syllabusId;
      this.documentId = syllabusId ? +syllabusId : 0;
      return;
    }

    // Вариант 2: Компонент открыт по прямой ссылке / роуту
    const idParam = this.route.snapshot.paramMap.get('id');
    this.documentId = idParam ? +idParam : 0;

    const queryTaskId = this.route.snapshot.queryParams['taskId'];
    if (queryTaskId) {
      this.resolvedTaskId = queryTaskId;
    }
  }

  downloadPdf() {
    this.http.get(
      `${environment.apiUrl}/api/signed-documents/download-pdf/${this.documentId}`,
      { responseType: 'blob' }
    ).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `syllabus_${this.documentId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Ошибка при скачивании PDF:', err)
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  uploadScan() {
    if (!this.selectedFile) return;

    this.isSubmitting.set(true);
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    // 1. Сначала загружаем скан в бэкенд (меняем статус на SIGNED в БД)
    this.http.post(
      `${environment.apiUrl}/api/signed-documents/upload/${this.documentId}`,
      formData
    ).subscribe({
      next: () => {
        this.uploadSuccess = true;
        this.selectedFile = null;

        // 2. Если задача привязана к Camunda, завершаем её, чтобы закрыть процесс
        if (this.resolvedTaskId) {
          this.completeCamundaTask();
        } else {
          this.isSubmitting.set(false);
          alert('Скан успешно сохранен в системе!');
        }
      },
      error: (err) => {
        console.error('Ошибка загрузки скана:', err);
        this.isSubmitting.set(false);
        alert('Не удалось загрузить файл на сервер.');
      }
    });
  }

  private completeCamundaTask() {
    // Вызываем твой сервис Camunda. Передаем, например, 'scanUploaded' = true
    this.camundaService.reviewTask(
      this.resolvedTaskId!,
      'scanUploaded',
      true,
      'Initiator',
      'Скан документа успешно загружен инициатором.'
    )
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          alert('Силлабус успешно подписан и процесс Camunda завершен!');
          if (this.task) {
            this.close.emit(); // Закрываем модалку в дашборде
          } else {
            this.router.navigate(['/approval-dashboard']); // Или редирект на список задач
          }
        },
        error: (err) => {
          console.error('Ошибка Camunda при завершении таски:', err);
          alert('Файл загружен, но не удалось обновить статус в Camunda.');
        }
      });
  }
}
