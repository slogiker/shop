import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../../models/button';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button [class]="config.class" (click)="handleClick()">
      <i *ngIf="config.icon" [class]="config.icon" class="mr-2"></i>
      {{ config.label }}
    </button>
  `,
  styles: []
})
export class ButtonComponent {
  @Input() config!: Button;

  handleClick() {
    if (this.config.action) {
      this.config.action();
    }
  }
}
