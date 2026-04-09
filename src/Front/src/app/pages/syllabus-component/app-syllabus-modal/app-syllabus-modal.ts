import {Component, input, output, signal, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseVolume } from '../../../Services/CourseVolume/CourseVolume';
import { CourseVolumeService } from '../../../Services/CourseVolume/CourseVolumeService';
import {switchMap} from 'rxjs';

import {AuthService} from '../../../Services/AuthService/AuthService';
import {SyllabusDocument} from '../../../Services/Document/Document';
import {DocumentService} from '../../../Services/Document/DocumetService';


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
