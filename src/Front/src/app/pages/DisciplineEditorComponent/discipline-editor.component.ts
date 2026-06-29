import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/AuthService/AuthService';
import { finalize } from 'rxjs';
import { DocumentService } from '../../Services/Document/DocumetService';
import {DocumentStatus, SyllabusDocument} from '../../Services/Document/Document';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-syllabus-editor',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './discipline-editor.component.html',
  styleUrl: './discipline-editor.component.scss'
})
export class DisciplineEditorComponent implements OnInit {
  private docService = inject(DocumentService);
  public authService = inject(AuthService);
  private router = inject(Router);

  documents = signal<SyllabusDocument[]>([]);
  isLoading = signal(false);
  activeListTab = signal<'all' | 'approved'>('all');

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

  filteredDocuments() {
    const docs = this.documents();
    if (this.activeListTab() === 'approved') {
      return docs.filter(d => d.status === DocumentStatus.APPROVED || d.status === DocumentStatus.SIGNED);
    }
    return docs.filter(d => d.status !== DocumentStatus.APPROVED && d.status !== DocumentStatus.SIGNED);
  }

  handleRowClick(doc: SyllabusDocument) {
    if (doc.status === DocumentStatus.APPROVED || doc.status === DocumentStatus.SIGNED) {
      this.router.navigate(['/syllabus', doc.id, 'variables'], { queryParams: { tab: 'uploadSigned' } });
    } else {
      this.router.navigate(['/syllabus', doc.id, 'variables']);
    }
  }
}
