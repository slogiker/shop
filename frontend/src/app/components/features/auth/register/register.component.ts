import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';
  loading = false;
  showPassword = false;
  showPasswordRepeat = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required], // Mapped to username for backend comp
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordRepeat: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('passwordRepeat')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = '';

      // Map form to backend expectations
      // Backend expects: username, email, password, passwordRepeat, dob
      // We send full object, backend will pick what it needs or we can manual map

      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          this.authService.setUser(this.registerForm.get('username')!.value);
          this.router.navigate(['/shop']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Registration failed';
          this.loading = false;
        }
      });
    }
  }
}
