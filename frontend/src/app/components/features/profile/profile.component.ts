import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  username = '';
  orders: any[] = [];
  ordersLoading = true;

  usernameForm: FormGroup;
  passwordForm: FormGroup;

  usernameMessage = '';
  usernameError = '';
  passwordMessage = '';
  passwordError = '';

  showCurrentPassword = false;
  showNewPassword = false;

  confirmDelete = false;
  deleteError = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.usernameForm = this.fb.group({
      newUsername: ['', Validators.required]
    });
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) this.username = user.username;
    });
    this.authService.getOrders().subscribe({
      next: (orders) => { this.orders = orders; this.ordersLoading = false; },
      error: () => { this.ordersLoading = false; }
    });
  }

  getOrderItems(products: any): string {
    if (!products) return '';
    const entries = Object.entries(products);
    return entries.map(([name, qty]) => `${name} x${qty}`).join(', ');
  }

  changeUsername() {
    this.usernameMessage = '';
    this.usernameError = '';
    if (this.usernameForm.invalid) return;
    const { newUsername } = this.usernameForm.value;
    this.authService.changeUsername(newUsername).subscribe({
      next: () => {
        this.authService.setUser(newUsername);
        this.username = newUsername;
        this.usernameMessage = 'Username updated successfully.';
        this.usernameForm.reset();
      },
      error: (err) => { this.usernameError = err.error?.message || 'Failed to update username'; }
    });
  }

  changePassword() {
    this.passwordMessage = '';
    this.passwordError = '';
    if (this.passwordForm.invalid) return;
    const { currentPassword, newPassword } = this.passwordForm.value;
    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.passwordMessage = 'Password updated successfully.';
        this.passwordForm.reset();
      },
      error: (err) => { this.passwordError = err.error?.message || 'Failed to update password'; }
    });
  }

  deleteAccount() {
    this.deleteError = '';
    this.authService.deleteAccount().subscribe({
      next: () => {
        this.authService.logoutClientSide();
        this.router.navigate(['/login']);
      },
      error: (err) => { this.deleteError = err.error?.message || 'Failed to delete account'; }
    });
  }
}
