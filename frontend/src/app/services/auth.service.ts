import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  private currenUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currenUserSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    this.http.get<{ authenticated: boolean, username: string }>(`${environment.apiUrl}/check-auth`)
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
          this.setUser(credentials.username);
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }

  setUser(username: string) {
    this.currenUserSubject.next({ username });
    this.isLoggedInSubject.next(true);
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders`);
  }

  changeUsername(newUsername: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/change-username`, { newUsername });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/change-password`, { currentPassword, newPassword });
  }

  deleteAccount(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-account`);
  }

  logout() {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe(() => {
      this.logoutClientSide();
      this.router.navigate(['/login']);
    });
  }

  logoutClientSide() {
    this.currenUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }
}
