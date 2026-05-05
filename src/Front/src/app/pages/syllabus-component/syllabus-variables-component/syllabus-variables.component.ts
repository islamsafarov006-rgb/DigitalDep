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
import {LibraryBook} from '../../../Services/Library/Library';
import {TableConfig} from '../../../models/table-config.model';

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
  imports: [CommonModule, TablesComponent, FormsModule],
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

  getTableConfig(tab: string): TableConfig {
    const literatureOptions = this.syllabus()?.syllabus?.literature?.map((lit, index) => ({
      value: (index + 1).toString(),
      label: `${index + 1}. ${lit.title || 'Untitled'}`
    })) || [];

    const optionsWithDefault = [
      { value: '', label: 'Select source...' },
      ...literatureOptions
    ];

    let cols: any[] = [];

    if (tab === 'lectures') {
      cols = [
        { key: 'weekNumber', title: 'Week/date', type: TableColumnTypes.index, width: '80px' },
        { key: 'lectureTopic', title: 'Course topics', type: TableColumnTypes.inputText },
        {
          key: 'references',
          title: 'References',
          type: TableColumnTypes.select,
          options: optionsWithDefault
        },
        { key: 'hours', title: 'Lectures (h/w)', type: TableColumnTypes.inputNumber, width: '90px' }
      ];
    } else {
      const topicKeys: Record<string, string> = {
        'practices': 'practiceTopic',
        'srsp': 'srspTopic',
        'srs': 'spzTopic'
      };

      cols = [
        { key: 'weekNumber', title: '№', type: TableColumnTypes.index, width: '60px' },
        { key: topicKeys[tab], title: 'Topic / Assignment title', type: TableColumnTypes.inputText },
        { key: 'hours', title: 'Hours', type: TableColumnTypes.inputNumber, width: '90px' },
        {
          key: 'references',
          title: 'References',
          type: TableColumnTypes.select,
          options: optionsWithDefault
        },
        { key: 'reportingForm', title: 'Form of reporting', type: TableColumnTypes.inputText },
        { key: 'deadline', title: 'Deadline', type: TableColumnTypes.inputText }
      ];
    }

    return {
      columns: cols as TableRowColumn[]
    };
  }

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
          const loadedDoc = res.doc;

          if (!loadedDoc.syllabus) {
            loadedDoc.syllabus = this.createNewSyllabus(loadedDoc.id!);
          }
          this.syllabus.set(loadedDoc);

          const rawTopics = (res.topics && res.topics.length > 0)
            ? res.topics
            : this.createDefaultTopics(id);

          this.distributeTopics(rawTopics);

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Ошибка загрузки:', err);
          this.isLoading.set(false);
        }
      });
  }


  private createDefaultTopics(documentId: number): WeeklyTopic[] {
    const defaultTopics: WeeklyTopic[] = [];

    for (let i = 1; i <= 15; i++) {
      let lect = '';
      let ref = 'Basic literature';



      defaultTopics.push({
        weekNumber: i,
        lectureTopic: lect,
        practiceTopic: lect,
        srspTopic: i === 2 ? 'PA (Points Assessment)' : '',
        spzTopic: i === 2 ? 'Choice of the topic (individual presentation)' : '',
        hours: 1,
        references: ref,
        reportingForm: i === 2 ? 'Report/Essay/Presentation' : '',
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

  addLiteratureLine() {
    const doc = this.syllabus();
    if (doc?.syllabus) {
      if (!doc.syllabus.literature) {
        doc.syllabus.literature = [];
      }
      const newBook: LibraryBook = {
        title: '',
        author: '',
        isbn: '',
        url: ''
      };
      doc.syllabus.literature.push(newBook);
    }
  }

  removeLiteratureLine(index: number) {
    const doc = this.syllabus();
    if (doc?.syllabus?.literature) {
      doc.syllabus.literature.splice(index, 1);
    }
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
