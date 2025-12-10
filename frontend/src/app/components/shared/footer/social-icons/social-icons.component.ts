import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Image } from '../../../../models/image';

@Component({
  selector: 'app-social-icons',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="d-flex gap-3">
      <a *ngFor="let icon of icons" href="#" class="social-icon-btn">
        <i [class]="icon.src"></i>
      </a>
    </div>
  `,
  styles: [`
    .social-icon-btn {
      width: 40px; 
      height: 40px;
      border-radius: 50%;
      background: rgba(255,255,255,0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border: 1px solid rgba(255,255,255,0.1);
    }
    .social-icon-btn:hover {
      background: var(--primary-gradient);
      transform: translateY(-5px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }
  `]
})
export class SocialIconsComponent {
  @Input() icons: Image[] = [];
}
