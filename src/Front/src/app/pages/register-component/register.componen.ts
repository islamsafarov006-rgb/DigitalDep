import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from '../../Services/AuthService/AuthService';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.componen.html',
  styleUrl: './register.componen.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      iin: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      position: ['Преподаватель', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          alert('Регистрация успешна!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMessage = 'Ошибка регистрации. Возможно, ИИН или Email уже заняты.';
          console.error(err);
        }
      });
    }
  }
}
