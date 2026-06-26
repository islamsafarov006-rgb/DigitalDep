import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SyllabusProcessService } from '../../../Services/SyllabusTaskService/SyllabusProcessService';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Services/AuthService/AuthService';

@Component({
  selector: 'app-syllabus-review',
  templateUrl: './syllabus-review.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./syllabus-review.component.scss']
})



export class SyllabusReviewComponent implements OnInit {
  syllabus: any; // Замените на вашу модель Syllabus
  taskId: string = '';
  comment: string = '';

  private authService = inject(AuthService);

  constructor(
    private route: ActivatedRoute,
    private service: SyllabusProcessService,
    private router: Router
  ) {}

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('taskId')!;
  }

  submit(approved: boolean) {
    if (!approved && !this.comment.trim()) {
      alert('Пожалуйста, укажите причину отклонения.');
      return;
    }

    const approverName = this.authService.getCurrentUserName();

    this.service.reviewTask(this.taskId, 'libApproved', approved, approverName, this.comment).subscribe({
      next: () => {
        this.router.navigate(['/librarian/tasks']);
      },
      error: (err) => {
        console.error('Ошибка при отправке решения:', err);
      }
    });
  }
}
