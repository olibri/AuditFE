import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateFn } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { DataService } from './dataService';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private authService: DataService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = this.authService.getRole();
    if (userRole === 'Admin') {
      return true;
    } else {
      this.router.navigate(['/audit']);
      return false;
    }
  }
}

export const adminOnlyGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authGuardService = inject(AuthGuardService);
  return authGuardService.canActivate(route, state);
};
