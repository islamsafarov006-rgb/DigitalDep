import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, finalize } from 'rxjs';
import { SyllabusDocument } from '../../../Services/Document/Document';
import { ContentService } from '../../../Services/Content/ContentService';
import { TablesComponent } from '../../../shared-new/tables/tables.component';
import { TableColumnTypes } from '../../../shared-new/tables/table-column-types';
import { WeeklyTopic } from '../../../Services/Content/GradingPolicyAndWeeklyTopic';
import { DocumentService } from '../../../Services/Document/DocumetService';
import { FormsModule } from '@angular/forms';
import { renderAsync } from 'docx-preview';


export interface TableRowColumn {
  key: string;
  title: string;
  type: TableColumnTypes;
  width?: string;
  options?: { value: string; label: string }[];
  multilingual?: any;
  objectColumn?: any;
}

@Component({
  selector: 'app-syllabus-variables',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './syllabus-variables.component.html',
  styleUrls: ['./syllabus-variables.component.scss']
})
export class SyllabusVariablesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contentService = inject(ContentService);
  private cdr = inject(ChangeDetectorRef);
  private documentService = inject(DocumentService);

  syllabus = signal<SyllabusDocument | null>(null);
  isLoading = signal(false);
  isPreviewLoading = false;
  activeTab: string = 'syllabusData';

  lectures: WeeklyTopic[] = [];
  practices: WeeklyTopic[] = [];
  srsp: WeeklyTopic[] = [];
  srs: WeeklyTopic[] = [];


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadData(+id);
  }

  loadData(id: number) {
    this.isLoading.set(true);
    forkJoin({
      doc: this.documentService.getById(id),
      topics: this.contentService.getWeeklyTopics(id)
    })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.syllabus.set(res.doc);
          const rawTopics = (res.topics && res.topics.length > 0)
            ? res.topics
            : this.createDefaultTopics(id);

          this.distributeTopics(rawTopics);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Ошибка:', err)
      });
  }

  get currentTopics(): WeeklyTopic[] {
    switch (this.activeTab) {
      case 'lectures': return this.lectures;
      case 'practices': return this.practices;
      case 'srsp': return this.srsp;
      case 'srs': return this.srs;
      default: return [];
    }
  }

  addLiteratureLine() {
    const doc = this.syllabus();
    if (doc?.syllabus) {
      if (!doc.syllabus.literature) doc.syllabus.literature = [];
      doc.syllabus.literature.push({ title: '', author: '', isbn: '', url: '' });
      this.cdr.detectChanges();
    }
  }

  removeLiteratureLine(index: number) {
    const doc = this.syllabus();
    if (doc?.syllabus?.literature) {
      doc.syllabus.literature.splice(index, 1);
      this.cdr.detectChanges();
    }
  }

  private createDefaultTopics(documentId: number): WeeklyTopic[] {
    const defaultTopics: WeeklyTopic[] = [];

    for (let i = 1; i <= 15; i++) {
      let lect = '';
      let ref = 'Clean Code: A Handbook of Agile Software Craftsmanship';



      defaultTopics.push({
        weekNumber: i,
        lectureTopic: '',
        practiceTopic: '',
        srspTopic:  '',
        spzTopic:  '',
        hours: 1,
        references: ref,
        reportingForm: 'Report/Essay/Presentation',
        deadline: 'one week period',
        document: { id: documentId } as any
      } as WeeklyTopic);
    }

    return defaultTopics;
  }


  private distributeTopics(topics: WeeklyTopic[]) {
    if (!topics) return;

    const sortedTopics = [...topics].sort((a, b) => a.weekNumber - b.weekNumber);
    this.lectures = sortedTopics;
    this.practices = sortedTopics;
    this.srsp = sortedTopics;
    this.srs = sortedTopics;
  }


  private createNewSyllabus(id: number) {
    return {
      id: id,
      academicProgramCode: '',
      academicProgramTitle: '',
      courseCycle: '',
      finalAssessment: '',
      goals: '',
      objectives: '',
      learningOutcomes: '',
      courseDescription: '',
      coursePolicy: '',
      literature: [],
      examinationTopics: '',
      numberOfCredits: 0,
      groupOfAcademicPrograms: ''
    };
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'preview') this.renderSyllabusPreview();
  }

  renderSyllabusPreview() {
    const docId = this.syllabus()?.id;
    if (!docId) return;
    this.isPreviewLoading = true;
    this.documentService.exportToWord(docId).subscribe({
      next: (blob) => {
        const container = document.getElementById('docx-container');
        if (container) {
          container.innerHTML = '';
          renderAsync(blob, container).then(() => {
            this.isPreviewLoading = false;
            this.cdr.detectChanges();
          });
        }
      },
      error: () => this.isPreviewLoading = false
    });
  }

  saveAll() {
    const doc = this.syllabus();
    if (!doc) return;
    this.isLoading.set(true);

    const allTopics = [...this.lectures, ...this.practices, ...this.srsp, ...this.srs];

    forkJoin({
      docSave: this.documentService.saveDiscipline(doc),
      topicsSave: this.contentService.saveWeeklyPlan(allTopics)
    })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => alert('Данные успешно сохранены!'),
        error: (err) => {
          console.error('Ошибка сохранения:', err);
          alert('Ошибка при сохранении данных');
        }
      });
  }

  getTableData(tab: string): WeeklyTopic[] {
    switch (tab) {
      case 'lectures':
        return this.lectures;
      case 'practices':
        return this.practices;
      case 'srsp':
        return this.srsp;
      case 'srs':
        return this.srs;
      default:
        return [];
    }
  }

  downloadWord(id: number) { this.documentService.downloadSyllabus(id); }
  goBack() { this.router.navigate(['/syllabus']); }


  onTableDataChange(event: any, tab: string) {
    const { event: newValue, key, index } = event;

    let targetArray: WeeklyTopic[] = [];
    switch (tab) {
      case 'lectures': targetArray = this.lectures; break;
      case 'practices': targetArray = this.practices; break;
      case 'srsp': targetArray = this.srsp; break;
      case 'srs': targetArray = this.srs; break;
    }

    if (targetArray[index]) {
      (targetArray[index] as any)[key] = newValue;
      this.cdr.detectChanges();
    }
  }
}
