import { Component, OnInit, inject, signal, ChangeDetectorRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, finalize } from 'rxjs';
import { AssessmentCriterion, SyllabusDocument } from '../../../Services/Document/Document';
import { ContentService } from '../../../Services/Content/ContentService';
import { GradingPolicyRow, WeeklyTopic } from '../../../Services/Content/GradingPolicyAndWeeklyTopic';
import { DocumentService } from '../../../Services/Document/DocumetService';
import { FormsModule } from '@angular/forms';
import { renderAsync } from 'docx-preview';
import { CamundaTask, SyllabusProcessService } from '../../../Services/SyllabusTaskService/SyllabusProcessService';
import {TranslocoPipe} from '@jsverse/transloco';

interface ExtendedWeeklyTopic extends Omit<WeeklyTopic, 'references'> {
  references: string | string[];
  isOpen?: boolean;
}

interface ProcessedComment {
  authorName: string;
  authorRole: string;
  text: string;
  date: string | null;
  decision: string;
}

@Component({
  selector: 'app-syllabus-variables',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoPipe],
  templateUrl: './syllabus-variables.component.html',
  styleUrls: ['./syllabus-variables.component.scss']
})
export class SyllabusVariablesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contentService = inject(ContentService);
  private cdr = inject(ChangeDetectorRef);
  private documentService = inject(DocumentService);
  private camundaService = inject(SyllabusProcessService);

  syllabus = signal<SyllabusDocument | null>(null);
  isLoading = signal(false);
  isPreviewLoading = false;
  private currentDocumentId: number = 0;
  activeFixTask = signal<CamundaTask | null>(null);
  activeTab = signal<string>('syllabusData');

  lectures: ExtendedWeeklyTopic[] = [];
  practices: ExtendedWeeklyTopic[] = [];
  srsp: ExtendedWeeklyTopic[] = [];
  srs: ExtendedWeeklyTopic[] = [];

  lectureHours  = signal<number>(15);
  practiceHours = signal<number>(15);
  siwtHours     = signal<number>(15);
  siwHours      = signal<number>(15);

  // 🌟 Таблица оценивания
  gradingPolicy: GradingPolicyRow[] = [];
  readonly gradingPeriods = ['1st attestation', '2nd attestation', 'Exam', 'Total'];

  // 🌟 Вычисляемая история замечаний проверяющих на основе полей сущности Syllabus
  getApprovalComments = computed<ProcessedComment[]>(() => {
    const doc = this.syllabus();
    if (!doc || !doc.syllabus) return [];

    const s = doc.syllabus as any;
    const commentsList: ProcessedComment[] = [];

    if (s.librarianComments && s.librarianComments.trim() !== '') {
      commentsList.push({
        authorName: s.librarianApprover || 'Библиотекарь',
        authorRole: 'Библиотекарь',
        text: s.librarianComments,
        date: s.librarianDecidedAt || null,
        decision: s.librarianDecision || 'PENDING'
      });
    }
    if (s.academicComments && s.academicComments.trim() !== '') {
      commentsList.push({
        authorName: s.academicApprover || 'Методист / Учебный отдел',
        authorRole: 'Методист',
        text: s.academicComments,
        date: s.academicDecidedAt || null,
        decision: s.academicDecision || 'PENDING'
      });
    }
    if (s.headComments && s.headComments.trim() !== '') {
      commentsList.push({
        authorName: s.headApprover || 'Заведующий кафедрой',
        authorRole: 'Заведующий кафедрой',
        text: s.headComments,
        date: s.headDecidedAt || null,
        decision: s.headDecision || 'PENDING'
      });
    }
    if (s.deanComments && s.deanComments.trim() !== '') {
      commentsList.push({
        authorName: s.deanApprover || 'Деканат',
        authorRole: 'Декан',
        text: s.deanComments,
        date: s.deanDecidedAt || null,
        decision: s.deanDecision || 'PENDING'
      });
    }

    // Сортировка: сначала старые замечания, в конце — самые свежие
    return commentsList.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  });

  currentTopics = computed<ExtendedWeeklyTopic[]>(() => {
    const tab = this.activeTab();
    switch (tab) {
      case 'lectures':  return this.lectures;
      case 'practices': return this.practices;
      case 'srsp':      return this.srsp;
      case 'srs':       return this.srs;
      default:          return [];
    }
  });

  assessmentCriteria: AssessmentCriterion[] = [
    { points: 5, criterion: '' },
    { points: 4, criterion: '' },
    { points: 3, criterion: '' },
    { points: 2, criterion: '' },
    { points: 1, criterion: '' },
    { points: 0, criterion: '' }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadData(+id);
  }

  loadData(id: number) {
    this.currentDocumentId = id;
    this.isLoading.set(true);

    forkJoin({
      doc:    this.documentService.getById(id),
      topics: this.contentService.getWeeklyTopics(id),
      policy: this.contentService.getGradingPolicy(id)
    })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          if (res.doc && !res.doc.syllabus) {
            res.doc.syllabus = {
              id: res.doc.id,
              academicProgramCode: '',
              academicProgramTitle: '',
              courseCycle: '',
              finalAssessment: '',
              numberOfCredits: 0,
              groupOfAcademicPrograms: '',
              goals: '',
              objectives: '',
              learningOutcomes: '',
              courseDescription: '',
              coursePolicy: '',
              literature: []
            } as any;
          } else if (res.doc && res.doc.syllabus) {
            res.doc.syllabus.goals = res.doc.syllabus.goals || '';
            res.doc.syllabus.objectives = res.doc.syllabus.objectives || '';
            res.doc.syllabus.learningOutcomes = res.doc.syllabus.learningOutcomes || '';
            res.doc.syllabus.courseDescription = res.doc.syllabus.courseDescription || '';
            res.doc.syllabus.coursePolicy = res.doc.syllabus.coursePolicy || '';
          }

          this.syllabus.set(res.doc);

          const incomingCriteria = res.doc?.syllabus?.assessmentCriteria;
          if (incomingCriteria && incomingCriteria.length > 0) {
            this.assessmentCriteria = [...incomingCriteria];
          }

          const volumes = (res.doc as any)?.courseVolumes;
          if (volumes && volumes.length > 0) {
            const cv = volumes[0];
            this.lectureHours.set(cv.lectures  || 15);
            this.practiceHours.set(cv.practice || 15);
            this.siwtHours.set(cv.siwt         || 15);
            this.siwHours.set(cv.siw           || 15);
          }

          this.gradingPolicy = res.policy ?? [];

          const rawTopics = (res.topics && res.topics.length > 0)
            ? res.topics
            : this.createDefaultTopics(id);

          this.distributeTopics(rawTopics);
          this.checkCamundaStatus();
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Ошибка при загрузке данных силлабуса:', err)
      });
  }

  checkCamundaStatus() {
    const currentDoc = this.syllabus();
    if (!currentDoc) return;

    const authorRaw = currentDoc.author as any;
    const currentLoggedInUser = authorRaw?.username || authorRaw?.name || 'Преподаватель';

    this.camundaService.getTasksByTeacher(currentLoggedInUser).subscribe({
      next: (tasks) => {
        const matchingTask = tasks.find(t =>
          (t.taskDefinitionKey === 'Task_FixSyllabus' || t.taskDefinitionKey === 'Task_Fix') &&
          t.assignee === currentLoggedInUser
        );
        this.activeFixTask.set(matchingTask ?? null);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Ошибка проверки статуса Camunda:', err)
    });
  }

  submitToApprovalPipeline() {
    const currentDoc = this.syllabus();
    if (!currentDoc) return;

    this.isLoading.set(true);
    const authorRaw = currentDoc.author as any;
    const initiatorName = authorRaw?.name || authorRaw?.username || authorRaw?.firstName || 'Преподаватель';
    const fixTask = this.activeFixTask();

    if (fixTask) {
      const serviceAsAny = this.camundaService as any;
      const completeObservable = serviceAsAny.completeFix
        ? serviceAsAny.completeFix(fixTask.id)
        : serviceAsAny.completeTask
          ? serviceAsAny.completeTask(fixTask.id, { fixApproved: { value: true, type: 'Boolean' } })
          : serviceAsAny.complete(fixTask.id, {});

      completeObservable
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: () => {
            alert('Исправления успешно отправлены на повторное согласование!');
            this.activeFixTask.set(null);
            this.checkCamundaStatus();
          },
          error: (err: any) => alert('Ошибка при отправке доработки: ' + (err.message || err))
        });
    } else {
      this.camundaService.startProcess(String(currentDoc.id), initiatorName)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: () => {
            alert('Силлабус успешно отправлен на проверку!');
            this.checkCamundaStatus();
          },
          error: (err: any) => alert('Ошибка запуска процесса согласования: ' + (err.message || err))
        });
    }
  }

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
    if (tab === 'preview') this.renderSyllabusPreview();
  }

  // ── Weekly topics ──────────────────────────────────────────────

  private distributeTopics(topics: WeeklyTopic[]) {
    if (!topics) return;

    const parseRefsToArr = (refs: string | undefined | null): string[] => {
      if (typeof refs === 'string' && refs.trim() !== '') {
        return refs.split(',').map(r => r.trim());
      }
      return [];
    };

    const topicMap = new Map<number, WeeklyTopic>();
    topics.forEach(t => topicMap.set(t.weekNumber, t));

    const buildRows = (count: number): ExtendedWeeklyTopic[] =>
      Array.from({ length: count }, (_, i) => {
        const weekNum = i + 1;
        const t = topicMap.get(weekNum);
        return {
          weekNumber:    weekNum,
          lectureTopic:  t?.lectureTopic  || '',
          practiceTopic: t?.practiceTopic || '',
          srspTopic:     t?.srspTopic     || '',
          spzTopic:      t?.spzTopic      || '',
          hours:         t?.hours         || 1,
          references:    parseRefsToArr(t?.references),
          reportingForm: t?.reportingForm || 'Report/Essay/Presentation',
          deadline:      t?.deadline      || 'one week period',
          documentId:    this.currentDocumentId,
          isOpen:        false
        };
      });

    this.lectures  = buildRows(this.lectureHours());
    this.practices = buildRows(this.practiceHours());
    this.srsp      = buildRows(this.siwtHours());
    this.srs       = buildRows(this.siwHours());
  }

  private createDefaultTopics(documentId: number): WeeklyTopic[] {
    const maxRows = Math.max(
      this.lectureHours(), this.practiceHours(),
      this.siwtHours(), this.siwHours(), 1
    );
    return Array.from({ length: maxRows }, (_, i) => ({
      weekNumber:    i + 1,
      lectureTopic:  '',
      practiceTopic: '',
      srspTopic:     '',
      spzTopic:      '',
      hours:         1,
      references:    '',
      reportingForm: 'Report/Essay/Presentation',
      deadline:      'one week period',
      document:      { id: documentId } as any
    } as WeeklyTopic));
  }

  isLitSelected(topic: ExtendedWeeklyTopic, litTitle: string): boolean {
    return Array.isArray(topic.references) && topic.references.includes(litTitle);
  }

  toggleReference(topic: ExtendedWeeklyTopic, litTitle: string): void {
    if (!Array.isArray(topic.references)) topic.references = [];
    const refs = topic.references as string[];
    const idx = refs.indexOf(litTitle);
    idx > -1 ? refs.splice(idx, 1) : refs.push(litTitle);
    this.cdr.detectChanges();
  }

  removeReference(topic: ExtendedWeeklyTopic, litTitle: string): void {
    if (Array.isArray(topic.references)) {
      const refs = topic.references as string[];
      const idx = refs.indexOf(litTitle);
      if (idx > -1) { refs.splice(idx, 1); this.cdr.detectChanges(); }
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

  // ── Grading Policy ─────────────────────────────────────────────

  addGradingRow(period: string) {
    const maxOrder = this.gradingPolicy.length > 0
      ? Math.max(...this.gradingPolicy.map(r => r.sortOrder ?? 0))
      : 0;
    this.gradingPolicy.push({
      period,
      assignmentName: '',
      subItem:        false,
      bold:           false,
      score:          null,
      total:          null,
      sortOrder:      maxOrder + 1
    });
    this.cdr.detectChanges();
  }

  removeGradingRow(index: number) {
    this.gradingPolicy.splice(index, 1);
    this.gradingPolicy.forEach((r, i) => r.sortOrder = i + 1);
    this.cdr.detectChanges();
  }

  getTotalByPeriod(period: string): number {
    return this.gradingPolicy
      .filter(r => r.period === period && !r.subItem)
      .reduce((sum, r) => sum + (r.score ?? 0), 0);
  }

  isFirstInPeriod(index: number): boolean {
    if (index === 0) return true;
    return this.gradingPolicy[index - 1].period !== this.gradingPolicy[index].period;
  }

  // ── Save ───────────────────────────────────────────────────────

  saveAll() {
    const doc = this.syllabus();
    if (!doc || !doc.syllabus) return;

    this.isLoading.set(true);
    doc.syllabus.assessmentCriteria = this.assessmentCriteria;

    const parseRefsToString = (refs: string | string[]): string =>
      Array.isArray(refs) ? refs.join(', ') : (refs || '');

    const maxLen = Math.max(
      this.lectures.length, this.practices.length,
      this.srsp.length, this.srs.length
    );

    const allTopics: WeeklyTopic[] = [];
    for (let i = 0; i < maxLen; i++) {
      const base = this.lectures[i] || this.practices[i] || this.srsp[i] || this.srs[i];
      if (!base) continue;

      const activeTabName = this.activeTab();
      let activeRefs = '';
      if      (activeTabName === 'lectures')  activeRefs = parseRefsToString(this.lectures[i]?.references  || '');
      else if (activeTabName === 'practices') activeRefs = parseRefsToString(this.practices[i]?.references || '');
      else if (activeTabName === 'srsp')      activeRefs = parseRefsToString(this.srsp[i]?.references      || '');
      else if (activeTabName === 'srs')       activeRefs = parseRefsToString(this.srs[i]?.references       || '');
      else                                    activeRefs = parseRefsToString(this.lectures[i]?.references  || '');

      allTopics.push({
        ...base,
        weekNumber:    i + 1,
        documentId:    this.currentDocumentId,
        lectureTopic:  this.lectures[i]?.lectureTopic   || '',
        practiceTopic: this.practices[i]?.practiceTopic || '',
        srspTopic:     this.srsp[i]?.srspTopic          || '',
        spzTopic:      this.srs[i]?.spzTopic            || '',
        references:    activeRefs
      } as WeeklyTopic);
    }

    this.gradingPolicy.forEach((r, i) => r.sortOrder = i + 1);

    forkJoin({
      docSave:    this.documentService.saveDiscipline(doc),
      topicsSave: this.contentService.saveWeeklyPlan(allTopics),
      policySave: this.contentService.saveGradingPolicy(doc.id!, this.gradingPolicy)
    })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          alert('Успешно сохранено!');
          this.renderSyllabusPreview();
          this.checkCamundaStatus();
        },
        error: (err) => console.error('Ошибка сохранения данных:', err)
      });
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

  downloadWord(id: number) { this.documentService.downloadSyllabus(id); }
  goBack() { this.router.navigate(['/syllabus']); }
  quickAddPractice1 = 5;
  quickAddPractice2 = 5;
  quickAddLab       = 5;

  quickAddRows(period: string, type: 'Practice' | 'Lab', count: number) {
    const maxOrder = this.gradingPolicy.length > 0
      ? Math.max(...this.gradingPolicy.map(r => r.sortOrder ?? 0))
      : 0;

    const label = type === 'Practice' ? 'Exercise' : 'Lab work';

    const existing = this.gradingPolicy.filter(r =>
      r.period === period && r.assignmentName.startsWith(label)
    ).length;

    for (let i = 1; i <= count; i++) {
      this.gradingPolicy.push({
        period,
        assignmentName: `${label} ${existing + i}`,
        subItem:   true,
        bold:      false,
        score:     null,
        total:     null,
        sortOrder: maxOrder + i
      });
    }
    this.cdr.detectChanges();
  }
}
