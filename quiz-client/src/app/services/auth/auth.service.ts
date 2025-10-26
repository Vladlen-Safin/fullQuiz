import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WindowEnvHelper } from 'src/app/helpers/window-env.helper';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IUser } from 'src/app/interface/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = WindowEnvHelper.getValue<string>('apiUrl');
  private backUrl = WindowEnvHelper.getValue<string>('backUrl');
  private currentUserSubject = new BehaviorSubject<any>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    // если токен уже есть — считаем пользователя залогиненным
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');

    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
      
    }
  }

  /** Авторизация */
  login(data: any): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/auth/login`, data).pipe(
      tap((res) => this.handleAuthSuccess(res))
    );
  }

  /** Регистрация */
  register(data: any): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/auth/register`, data).pipe(
      tap((res) => this.handleAuthSuccess(res))
    );
  }

  /** Выход */
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /** Получить accessToken */
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /** Получить refreshToken */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /** Проверить, авторизован ли пользователь */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /** Обновить accessToken */
  refreshAccessToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post(`${this.apiUrl}/auth/refresh`, { refreshToken }).pipe(
      tap((res: any) => {
        localStorage.setItem('accessToken', res.accessToken);
      })
    );
  }

  /** Обработать успешную аутентификацию */
  private handleAuthSuccess(res: IUser) {
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.currentUserSubject.next(res.user);
  }
}
