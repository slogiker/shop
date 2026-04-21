import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button.component';
import { Button } from '../../../models/button';
import { AuthService } from '../../../services/auth.service';
import { ShopService } from '../../../services/shop.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  username = '';
  basketCount = 0;

  loginButton: Button = {
    label: 'Login',
    class: 'btn-outline-premium mr-2',
    action: () => this.router.navigate(['/login'])
  };

  registerButton: Button = {
    label: 'Register',
    class: 'btn-premium',
    action: () => this.router.navigate(['/register'])
  };

  logoutButton: Button = {
    label: 'Logout',
    class: 'btn-outline-premium',
    icon: 'fas fa-sign-out-alt',
    action: () => this.authService.logout()
  };

  constructor(private router: Router, public authService: AuthService, private shopService: ShopService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) this.shopService.refreshBasketCount();
      else this.shopService.basketCount$.next(0);
    });
    this.authService.currentUser$.subscribe(user => {
      if (user) this.username = user.username;
    });
    this.shopService.basketCount$.subscribe(count => this.basketCount = count);
  }
}
