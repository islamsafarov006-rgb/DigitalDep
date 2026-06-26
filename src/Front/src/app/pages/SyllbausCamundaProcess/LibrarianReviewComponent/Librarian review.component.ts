import {
  Component, Output, EventEmitter,
  OnInit, inject, signal, computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../../../Services/Document/DocumetService';
import { SyllabusDocument } from '../../../Services/Document/Document';
import { SyllabusProcessService } from '../../../Services/SyllabusTaskService/SyllabusProcessService';
import { SyllabusApprovalService, CamundaTask } from '../../../Services/SyllabusApprovalService/SyllabusApprovalService';
import { AuthService } from '../../../Services/AuthService/AuthService';

@Component({
  selector: 'app-librarian-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './Librarian review.component.html',
  styleUrl: './Librarian review.component.scss'
})
export class LibrarianReviewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private processService = inject(SyllabusProcessService);
  private approvalService = inject(SyllabusApprovalService);
  private docService = inject(DocumentService);
  private authService = inject(AuthService);

  task = signal<CamundaTask | null>(null);
  document = signal<SyllabusDocument | null>(null);
  isLoading = signal(true);
  isSubmitting = signal(false);
  comment = '';

  literature = computed(() => this.document()?.syllabus?.literature ?? []);

  ngOnInit() {
    const taskId = this.route.snapshot.queryParams['taskId'];

    if (!taskId) {
      console.error('taskId отсутствует в queryParams');
      this.isLoading.set(false);
      return;
    }

    // Загружаем задачу по taskId через сервис
    this.approvalService.fetchTasks('LIBRARIAN', 'active').subscribe({
      next: (tasks) => {
        const found = tasks.find(t => t.id === taskId);
        if (!found) {
          console.error('Задача не найдена:', taskId);
          this.isLoading.set(false);
          return;
        }
        this.task.set(found);

        const syllabusId = found.syllabusId;
        if (syllabusId && !isNaN(Number(syllabusId))) {
          this.docService.getById(Number(syllabusId)).subscribe({
            next: (doc) => {
              this.document.set(doc);
              this.isLoading.set(false);
            },
            error: (err) => {
              console.error('Ошибка загрузки документа:', err);
              this.isLoading.set(false);
            }
          });
        } else {
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        console.error('Ошибка загрузки задач:', err);
        this.isLoading.set(false);
      }
    });
  }

  submit(approved: boolean) {
    const t = this.task();
    if (!t) return;

    if (!approved && !this.comment.trim()) {
      alert('Пожалуйста, укажите причину отклонения.');
      return;
    }

    this.isSubmitting.set(true);

    const approverName = this.authService.getCurrentUserName();

    this.processService.reviewTask(t.id, 'libApproved', approved, approverName, this.comment).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(['/approval-dashboard']);
      },
      error: (err) => {
        console.error('Ошибка отправки решения:', err);
        this.isSubmitting.set(false);
      }
    });
  }

}
