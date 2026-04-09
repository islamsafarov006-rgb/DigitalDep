import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-syllabus-variables',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './syllabus-variables.component.html',
  styleUrls: ['./syllabus-variables.component.scss']
})
export class SyllabusVariablesComponent implements OnInit {
  @Output() variablesChanged = new EventEmitter<any[]>();

  varsForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.varsForm = this.fb.group({
      variables: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Добавляем пустую строку при инициализации
    this.addVariable();
  }

  get variables(): FormArray {
    return this.varsForm.get('variables') as FormArray;
  }

  addVariable() {
    const varGroup = this.fb.group({
      key: ['', [Validators.required, Validators.pattern(/^[a-zA-Z_][a-zA-Z0-9_]*$/)]],
      label: ['', Validators.required],
      type: ['number', Validators.required],
      defaultValue: ['', Validators.required]
    });
    this.variables.push(varGroup);
  }

  removeVariable(index: number) {
    this.variables.removeAt(index);
    this.emitChanges();
  }

  emitChanges() {
    if (this.varsForm.valid) {
      this.variablesChanged.emit(this.varsForm.value.variables);
    }
  }
}
