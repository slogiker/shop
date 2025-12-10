import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/auth'; // Proxy in angular.json will handle this or we set absolute path if needed

  private currenUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currenUserSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    this.http.get<{ authenticated: boolean, username: string }>('/check-auth')
      .subscribe({
        next: (res) => {
          if (res.authenticated) {
            this.currenUserSubject.next({ username: res.username });
            this.isLoggedInSubject.next(true);
          } else {
            this.logoutClientSide();
          }
        },
        error: () => this.logoutClientSide()
      });
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.success) {
          this.checkAuthStatus();
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }

  logout() {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe(() => {
      this.logoutClientSide();
      this.router.navigate(['/login']);
    });
  }

  private logoutClientSide() {
    this.currenUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }
}
