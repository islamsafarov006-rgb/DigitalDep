import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-syllabus-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-syllabus-modal.html',
  styleUrl: './app-syllabus-modal.scss'
})
export class SyllabusModalComponent {
  // Входные данные (сам силлабус)
  syllabusData = input.required<any>();
  // Событие закрытия
  close = output<void>();
}


