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
    if (this.ControlService.isLoggedIn()) {
      // User is already logged in, redirect to the respective dashboard based on user type
      this.router.navigate(['/d']);
      return false; 
    }

    // User is not logged in, allow access to the login page
    return true;
  }
  
}
