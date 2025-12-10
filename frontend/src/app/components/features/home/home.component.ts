import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/button/button.component';
import { Button } from '../../../models/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  heroButton: Button = {
    label: 'Explore Products',
    class: 'btn-premium btn-lg shadow-lg',
    icon: 'fas fa-rocket',
    action: () => this.router.navigate(['/shop'])
  };

  constructor(private router: Router) { }
}
