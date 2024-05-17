import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './login-page.component.html',
  styles: ``,
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public myForm = this.fb.group({
    email: ['santiago@correo.com', [Validators.email, Validators.required]],
    password: ['41450482', [Validators.minLength(6), Validators.required]],
  });

  public login() {
    if (!this.myForm.valid) {
      this.myForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.myForm.value;

    this.authService.login(email!, password!).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (message) => Swal.fire('Error', message, 'error'),
    });
  }
}
