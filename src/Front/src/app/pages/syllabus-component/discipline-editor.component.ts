import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../Services/AuthService/AuthService';
import { finalize } from 'rxjs';
import { DisciplineModalComponent } from '../discipline-form/discipline-modal-component/discipline-modal.component';
import { SyllabusModalComponent } from './app-syllabus-modal/app-syllabus-modal';
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
  private dialog = inject(MatDialog); // Внедряем MatDialog
  private destroyRef = inject(DestroyRef);
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

  openViewModal(doc: SyllabusDocument) {
    this.dialog.open(SyllabusModalComponent, {
      width: '85%',
      height: '90%',
      data: { syllabus: doc }
    })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }


  openSyllabus(doc: SyllabusDocument) {
    this.dialog.open(DisciplineModalComponent, {
      width: 'auto',
      minWidth: '800px',
      maxWidth: '98vw',
      data: { syllabusData: doc }
    })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(result => {
        if (result) {
          this.UpdateDiscipline(result);
        }
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

