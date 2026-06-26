import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../Services/Document/DocumetService';

interface TeacherGroup {
  fullName: string;
  position: string;
  email: string;
  disciplines: { name: string; code: string; credits: number }[];
}

@Component({
  selector: 'app-teachers-disciplines',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teachers-disciplines.component.html',
  styleUrls: ['./teachers-disciplines.component.scss']
})
export class TeachersDisciplinesComponent implements OnInit {
  private documentService = inject(DocumentService);
  private cdr = inject(ChangeDetectorRef); // 🌟 Внедряем ручной контроль детекции

  teacherGroups: TeacherGroup[] = [];
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.documentService.getAllDocuments().subscribe({
      next: (documents: any[]) => {
        if (documents && documents.length > 0) {
          this.groupDisciplinesByTeacher(documents);
        } else {
          this.teacherGroups = [];
        }
        this.isLoading = false;
        this.cdr.detectChanges(); // 🌟 Принудительно заставляем Angular перерисовать UI
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Не удалось загрузить данные. Проверьте права доступа.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private groupDisciplinesByTeacher(documents: any[]): void {
    const groups: { [key: string]: TeacherGroup } = {};

    documents.forEach(doc => {
      // Максимально безопасный парсинг сущностей
      const author = doc?.author;
      const discipline = doc?.discipline;

      if (author && author.fullName && discipline && discipline.name) {
        const teacherName = author.fullName;

        if (!groups[teacherName]) {
          groups[teacherName] = {
            fullName: teacherName,
            position: author.position || 'Преподаватель',
            email: author.email || '—',
            disciplines: []
          };
        }

        const discName = discipline.name;

        // Берем код из дисциплины, либо вытаскиваем из силлабуса
        const discCode = discipline.courseCode || doc.syllabus?.academicProgramCode || 'Н/Д';

        // Вычисляем кредиты
        let discCredits = 5; // Значение по умолчанию
        if (doc.courseVolumes && doc.courseVolumes.length > 0 && doc.courseVolumes[0]?.total) {
          discCredits = Math.round(doc.courseVolumes[0].total / 30);
        } else if (discipline.creditsEcts) {
          discCredits = discipline.creditsEcts;
        }

        // Защита от дублирования по имени предмета
        const isDisciplineAdded = groups[teacherName].disciplines.some(
          d => d.name.trim().toLowerCase() === discName.trim().toLowerCase()
        );

        if (!isDisciplineAdded) {
          groups[teacherName].disciplines.push({
            name: discName,
            code: discCode,
            credits: discCredits
          });
        }
      }
    });

    // 🌟 Создаем абсолютно новую ссылку на массив, чтобы *ngFor точно её зафиксировал
    this.teacherGroups = [...Object.values(groups)];
  }
}
