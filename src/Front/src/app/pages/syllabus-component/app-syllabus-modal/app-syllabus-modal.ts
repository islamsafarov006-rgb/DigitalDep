import {Component, input, output, signal, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseVolume } from '../../../Services/CourseVolume/CourseVolume';
import { CourseVolumeService } from '../../../Services/CourseVolume/CourseVolumeService';
import {switchMap} from 'rxjs';
import {SyllabusDocument} from '../../../Services/syllabus/Syllabus';
import {DocumentService} from '../../../Services/syllabus/SyllabusService';
import {AuthService} from '../../../Services/AuthService/AuthService';
import {ThisReceiver} from '@angular/compiler';



@Component({
  selector: 'app-syllabus-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-syllabus-modal.html',
  styleUrl: './app-syllabus-modal.scss'
})
export class SyllabusModalComponent implements OnInit {
  authService = inject(AuthService);
  syllabusData = input.required<SyllabusDocument>();

  close = output<void>();

  courseVolume = signal<CourseVolume | null>(null);

  constructor(
    private courseVolumeService: CourseVolumeService,
    private documentService: DocumentService
  ) {}

  ngOnInit() {
    const id = this.syllabusData().id;
    if (id) {
      this.loadSyllabusData(id);
    }
    const user = this.authService.currentUser();
  }

  loadSyllabusData(id: number) {
    this.documentService.getById(id).pipe(
      switchMap((doc: any) => {
        return this.courseVolumeService.getByDocumentId(id);
      })
    ).subscribe({
      next: (volume) => {
        this.courseVolume.set(volume);
      },
      error: (err) => console.error('Ошибка загрузки данных:', err)
    });
  }

  printDocument() {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
  calculateTotal(): number {
    const vol = this.courseVolume();
    if (!vol) return 0;
    return (vol.lectures || 0) + (vol.practice || 0) + (vol.siw || 0) + (vol.siwt || 0);
  }

  stopProp(event: MouseEvent) {
    event.stopPropagation();
  }
}
