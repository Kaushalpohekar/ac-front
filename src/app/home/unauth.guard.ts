import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ControlService } from './control.service';

@Injectable({
  providedIn: 'root'
})
export class UnauthGuard implements CanActivate {

  constructor(private ControlService: ControlService, private router: Router) {}


  canActivate(): boolean {
  console.log('UnauthGuard is being triggered');
  const isLoggedIn = this.ControlService.isLoggedIn();
  const storedToken = sessionStorage.getItem('token');
  if (isLoggedIn && storedToken) {
    console.log('Redirecting to dashboard');
    this.router.navigate(['/d']);
    return false; 
  }

  console.log('Allowing access to login page');
  return true;
}

  
}
