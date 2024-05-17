import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environments } from '../../environments/environments';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { CheckTokenResponse } from '../interfaces/check-token-response.interface';
import { LoginResponse } from '../interfaces/login-response.interface';
import { RegisterRequest } from '../interfaces/register-request.interface';
import { RegisterResponse } from '../interfaces/register-response';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environments.baseUrl;
  private http = inject(HttpClient);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.CHECKING);

  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ user, token }) => this.setAuth(user, token)),
      catchError((err: HttpErrorResponse) =>
        throwError(() => err.error.message)
      )
    );
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<CheckTokenResponse>(url, {
        headers,
      })
      .pipe(
        map(({ token, user }) => this.setAuth(user, token)),
        catchError(() => {
          this._authStatus.set(AuthStatus.NOT_AUTHENTICATED);

          return of(false);
        })
      );
  }

  private setAuth(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.AUTHENTICATED);
    localStorage.setItem('token', token);

    return true;
  }

  logout() {
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.NOT_AUTHENTICATED);
    localStorage.removeItem('token');
  }

  register(payload: RegisterRequest): Observable<boolean> {
    const url = `${this.baseUrl}/auth/register`;
    return this.http.post<RegisterResponse>(url, payload).pipe(
      map(({ token, user }) => this.setAuth(user, token)),
      catchError((err: HttpErrorResponse) =>
        throwError(() => err.error.message)
      )
    );
  }
}
