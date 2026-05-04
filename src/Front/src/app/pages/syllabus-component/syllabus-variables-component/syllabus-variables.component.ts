import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, finalize } from 'rxjs';
import { SyllabusDocument } from '../../../Services/Document/Document';
import { ContentService } from '../../../Services/Content/ContentService';
import { TableConfig } from '../../../models/table-config.model';
import { TablesComponent } from '../../../shared-new/tables/tables.component';
import { TableColumnTypes } from '../../../shared-new/tables/table-column-types';
import { WeeklyTopic } from '../../../Services/Content/GradingPolicyAndWeeklyTopic';
import { DocumentService } from '../../../Services/Document/DocumetService';
import { FormsModule } from '@angular/forms';
import { renderAsync } from 'docx-preview';
import {LibraryBook} from '../../../Services/Library/Library';

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

  lectureConfig: TableConfig = { columns: this.getColumns('lectureTopic') };
  practiceConfig: TableConfig = { columns: this.getColumns('practiceTopic') };
  srspConfig: TableConfig = { columns: this.getColumns('srspTopic') };
  srsConfig: TableConfig = { columns: this.getColumns('spzTopic') };

  private getColumns(topicKey: string) {
    return [
      { key: 'weekNumber', title: '№', type: TableColumnTypes.index, width: '60px' },
      { key: topicKey, title: 'Тема занятия', type: TableColumnTypes.inputText },
      { key: 'hours', title: 'Часы', type: TableColumnTypes.inputNumber, width: '100px' },
      { key: 'references', title: 'Литература', type: TableColumnTypes.inputText },
      { key: 'reportingForm', title: 'Форма отчетности', type: TableColumnTypes.inputText },
      { key: 'deadline', title: 'Дедлайн', type: TableColumnTypes.inputText }
    ];
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
          this.distributeTopics(res.topics);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Ошибка загрузки:', err)
      });
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
      // Инициализируем объект согласно интерфейсу LibraryBook
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

  private distributeTopics(topics: WeeklyTopic[]) {
    if (!topics) return;
    this.lectures = topics.filter(t => t.lectureTopic);
    this.practices = topics.filter(t => t.practiceTopic);
    this.srsp = topics.filter(t => t.srspTopic);
    this.srs = topics.filter(t => t.spzTopic);
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

  getTableConfig(tab: string) {
    const configs: any = {
      lectures: this.lectureConfig,
      practices: this.practiceConfig,
      srsp: this.srspConfig,
      srs: this.srsConfig
    };
    return configs[tab];
  }

  getTableData(tab: string) {
    const data: any = {
      lectures: this.lectures,
      practices: this.practices,
      srsp: this.srsp,
      srs: this.srs
    };
    return data[tab];
  }

  downloadWord(id: number) { this.documentService.downloadSyllabus(id); }
  goBack() { this.router.navigate(['/syllabus-editor']); }
}
