import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { SharedService } from 'src/app/_services/shared.service';
import { AuthenticationService } from '../_services/authentication.service';


@Injectable({
    providedIn: 'root',
})
export class SellGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthenticationService
    ) { }

    async canActivate(next: ActivatedRouteSnapshot): Promise<boolean> {
        const isSellOnboarded = await this.authService.isSellOnboarded();

        if (!isSellOnboarded) {
            if (next.url.length > 0) {
                this.router.navigate(['/sell-onboard'], { queryParams: { returnUrl: next.url[0].path } });
            } else {
                this.router.navigate(['/sell-onboard']);
            }
            return false;
        }

        return true;
    }
}
