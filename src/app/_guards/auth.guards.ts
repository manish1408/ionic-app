import { SharedService } from './../_services/shared.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { get, set } from '../_services/storage.service';
import { AuthenticationService } from '../_services/authentication.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private sharedService: SharedService,
    private authService: AuthenticationService
  ) { }

  async canActivate(): Promise<boolean> {

    if (this.sharedService.token) {
      const value = await this.authService.isOnboarded();

      if (value)
        return true;

      this.router.navigate(['/onboard']);
      return false;
    }

    const authToken = await get('token');
    if (authToken) {
      this.sharedService.token = authToken;
      const value = await this.authService.isOnboarded();

      if (value) {
        return true;
      }

      this.router.navigate(['/onboard']);
      return false;
    }

    this.router.navigate(['/authentication']);
    return false;
  }
}