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
import {DocumentService} from '../../../Services/Document/DocumetService';

@Component({
  selector: 'app-syllabus-variables',
  standalone: true,
  imports: [CommonModule, TablesComponent],
  templateUrl: './syllabus-variables.component.html',
  styleUrls: ['./syllabus-variables.component.scss']
})
export class SyllabusVariablesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contentService = inject(ContentService);
  private cdr = inject(ChangeDetectorRef);
  private document = inject(DocumentService);

  syllabus = signal<SyllabusDocument | null>(null);
  isLoading = signal(false);

  lectures: WeeklyTopic[] = [];
  practices: WeeklyTopic[] = [];
  srsp: WeeklyTopic[] = [];
  srs: WeeklyTopic[] = [];

  private baseColumns = [
    { key: 'weekNumber', title: '№', type: TableColumnTypes.index, width: '60px' },
    { key: 'lectureTopic', title: 'Topic Title', type: TableColumnTypes.text },
    { key: 'hours', title: 'Hours', type: TableColumnTypes.inputNumber, width: '100px' },
    { key: 'references', title: 'References', type: TableColumnTypes.inputText },
    { key: 'reportingForm', title: 'Reporting', type: TableColumnTypes.inputText },
    { key: 'deadline', title: 'Deadline', type: TableColumnTypes.inputText }
  ];

  lectureConfig: TableConfig = { columns: this.baseColumns };
  practiceConfig: TableConfig = { columns: this.baseColumns };
  srspConfig: TableConfig = { columns: this.baseColumns };
  srsConfig: TableConfig = { columns: this.baseColumns };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadData(Number(id));
  }

  loadData(id: number) {
    this.isLoading.set(true);

    forkJoin({
      doc: this.document.getById(id),
      topics: this.contentService.getWeeklyTopics(id)
    })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.syllabus.set(res.doc);
          this.lectures = res.topics.filter(t => t.lectureTopic);
          this.practices = res.topics.filter(t => t.practiceTopic);
          this.srsp = res.topics.filter(t => t.srspTopic);
          this.srs = res.topics.filter(t => t.spzTopic);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Ошибка загрузки:', err)
      });
  }

  saveAll() {
    this.isLoading.set(true);
    const allTopics = [...this.lectures, ...this.practices, ...this.srsp, ...this.srs];
    this.contentService.saveWeeklyPlan(allTopics)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe(() => alert('Сохранено!'));
  }

  goBack() { this.router.navigate(['/syllabus-editor']); }
}

