import { SharedService } from './../_services/shared.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { get, set } from '../_services/storage.service';
import { AuthenticationService } from '../_services/authentication.service';


@Injectable({
    providedIn: 'root',
})
export class OnboardGuard implements CanActivate {
    constructor(
        private router: Router,
        private sharedService: SharedService,
        private authService: AuthenticationService
    ) { }

    async canActivate(): Promise<boolean> {

        if (this.sharedService.token) {
            const value = await this.authService.isOnboarded();

            if (value) {
                this.router.navigate(['/tabs/home']);
                return false;
            }
            return true;
        }

        const authToken = await get('token');
        if (authToken) {
            this.sharedService.token = authToken;
            const value = await this.authService.isOnboarded();

            if (value) {
                this.router.navigate(['/tabs/home']);
                return false;
            }

            return true;
        }

        this.router.navigate(['/authentication']);
        return false;
    }
}