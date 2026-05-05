import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/AuthService/AuthService';
import { finalize } from 'rxjs';
import { DocumentService } from '../../Services/Document/DocumetService';
import { SyllabusDocument } from '../../Services/Document/Document';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-syllabus-editor',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule
  ],
  templateUrl: './discipline-editor.component.html',
  styleUrl: './discipline-editor.component.scss'
})
export class DisciplineEditorComponent implements OnInit {
  private docService = inject(DocumentService);
  public authService = inject(AuthService);
  private router = inject(Router);

  documents = signal<SyllabusDocument[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.isLoading.set(true);
    this.docService.getAll()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => this.documents.set(data),
      });
  }


  UpdateDiscipline(updatedDoc: SyllabusDocument) {
    this.documents.update(docs =>
      docs.map(d => d.id === updatedDoc.id ? updatedDoc : d)
    );
  }


  createDiscipline() {
    this.router.navigate(['/create-disciplines']);
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToVariables(docId: number | undefined) {
    this.router.navigate(['/syllabus', docId, 'variables']);
  }
}

