import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { SharedService } from 'src/app/_services/shared.service';
import { AuthenticationService } from '../_services/authentication.service';
import { SignalService } from '../_services/signal.service';
import { get } from '../_services/storage.service';


@Injectable({
    providedIn: 'root',
})
export class AcknowledgeGuard implements CanActivate {
    constructor(
        private authService: AuthenticationService,
        private router: Router,
    ) { }

    async canActivate(next: ActivatedRouteSnapshot): Promise<boolean> {
        const user = await this.authService.getUser();
        if (user.hasAcknowledged) {
            return true;
        }

        this.router.navigate(['acknowledge']);
        return false;
    }
}
