import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuth();
  }

  private async checkAuth() {
    const authRes = this.authService.isAuthenticated();
    const hasLaunchedRes = this.authService.hasLaunchedApp();
    if (!hasLaunchedRes) {
      this.routeToLogin();
    }
    if (!authRes && !hasLaunchedRes) {
      this.routeToLogin();
    }
    if (hasLaunchedRes && !authRes) {
      this.routeToLogin();
    }
    return true;
  }

  private routeToLogin() {
    this.router.navigate(['/login']);
  }
}
