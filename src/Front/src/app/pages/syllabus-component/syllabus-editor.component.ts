import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SyllabusModalComponent } from './app-syllabus-modal/app-syllabus-modal';
import { DocumentService } from '../../Services/syllabus/SyllabusService';
import { SyllabusDocument } from '../../Services/syllabus/Syllabus';
import { AuthService } from '../../Services/AuthService/AuthService';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SyllabusModalComponent],
  templateUrl: './syllabus-editor.component.html',
  styleUrl: './syllabus-editor.component.scss'
})
export class SyllabusEditorComponent {
  private docService = inject(DocumentService);
  public authService = inject(AuthService);
  private router = inject(Router);

  isModalOpen = signal(false);
  isLoading = signal(false);
  selectedSyllabus = signal<SyllabusDocument | null>(null);

  openSyllabus(id: number) {
    this.isLoading.set(true);
    this.docService.getById(id).subscribe({
      next: (data: SyllabusDocument) => {
        this.selectedSyllabus.set(data);
        this.isModalOpen.set(true);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Ошибка при загрузке:', err);
        this.isLoading.set(false);
      }
    });
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedSyllabus.set(null);
  }

  handleLogout() {
    this.authService.logout();

    this.closeModal();

    this.selectedSyllabus.set(null);

    this.router.navigate(['/login']);
  }
  createDiscipline() {
    console.log('Создание новой дисциплины...');
  }
}
