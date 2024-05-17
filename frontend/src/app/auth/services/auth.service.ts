import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environments } from '../../environments/environments';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { LoginResponse } from '../interfaces/login-response.interface';
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

  constructor() {}

  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      tap(({ user, token }) => {
        this._currentUser.set(user);
        this._authStatus.set(AuthStatus.AUTHENTICATED);

        localStorage.setItem('token', token);
      }),
      map(() => true),
      catchError((err: HttpErrorResponse) =>
        throwError(() => err.error.message)
      )
    );
  }
}
