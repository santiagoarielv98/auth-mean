import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';

@Component({
  templateUrl: './login-page.component.html',
  styles: ``,
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  public myForm = this.fb.group({
    email: ['', Validators.email, Validators.required],
    password: ['', Validators.minLength(6), Validators.required],
  });

  public login() {
    if (!this.myForm.valid) {
      this.myForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.myForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (message) => Swal.fire('Error', message, 'error'),
    });
  }
}
