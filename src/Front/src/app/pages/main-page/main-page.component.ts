import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {AuthService} from '../../Services/AuthService/AuthService';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  constructor(public authService: AuthService) {}
}
