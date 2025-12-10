import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Link } from '../../../../models/link';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer-links',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="d-flex flex-column">
      <h5 class="text-primary mb-3">{{ title }}</h5>
      <a *ngFor="let link of links" 
         [routerLink]="link.url" 
         class="text-muted hover-white mb-2 decoration-none transition-all">
        <i class="fas fa-chevron-right mr-2 text-primary text-xs"></i>{{ link.text }}
      </a>
    </div>
  `,
  styles: [`
    .hover-white:hover { color: white !important; transform: translateX(5px); }
    .text-xs { font-size: 0.75rem; }
    .transition-all { transition: all 0.3s ease; }
  `]
})
export class FooterLinksComponent {
  @Input() title: string = 'Links';
  @Input() links: Link[] = [];
}
