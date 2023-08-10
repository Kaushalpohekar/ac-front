import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ControlService } from './control.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private ControlService: ControlService, private router: Router) {}

  canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  const isLoggedIn = this.ControlService.isLoggedIn();
  const storedToken = sessionStorage.getItem('token');

  if (isLoggedIn && storedToken) {
    const tokenMatches = storedToken === this.ControlService.getToken();
    if (tokenMatches) {
      return true;
    } else {
      this.router.navigate(['/access-denied']);
      return false;
    }
  } else {
    this.router.navigate(['/login']);
    return false;
  }
}
}
