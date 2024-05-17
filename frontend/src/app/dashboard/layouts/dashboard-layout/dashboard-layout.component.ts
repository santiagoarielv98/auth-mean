import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styles: ``,
})
export class DashboardLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public user = computed(() => this.authService.currentUser());

  onLogout() {
    this.router.navigateByUrl('/auth/login');
    this.authService.logout();
  }
}
