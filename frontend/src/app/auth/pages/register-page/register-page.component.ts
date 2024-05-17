import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  templateUrl: './register-page.component.html',
  styles: ``,
})
export class RegisterPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public myForm = this.fb.group({
    email: ['santiago@correo.com', [Validators.required, Validators.email]],
    password: ['41450482', [Validators.required, Validators.minLength(6)]],
    name: ['santiago', [Validators.required, Validators.minLength(6)]],
  });

  public register() {
    if (!this.myForm.valid) {
      this.myForm.markAllAsTouched();
      return;
    }
    const payload = {
      name: this.myForm.value.name!,
      email: this.myForm.value.email!,
      password: this.myForm.value.password!,
    };

    this.authService.register(payload).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (message) => Swal.fire('Error', message, 'error'),
    });
  }
}
