import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { SharedService } from 'src/app/_services/shared.service';
import { SignalService } from '../_services/signal.service';
import { get } from '../_services/storage.service';


@Injectable({
    providedIn: 'root',
})
export class SignalGuard implements CanActivate {
    constructor(
        private router: Router,
        private signalService: SignalService,
        private sharedService: SharedService,
    ) { }

    async canActivate(next: ActivatedRouteSnapshot): Promise<boolean> {

        if (!this.sharedService.token) {
            const authToken = await get('token');
            if (authToken) {
                this.sharedService.token = authToken;
            } else {
                return false;
            }
        }

        const signalId = next.params.id;

        if (!signalId) return false;

        const response = await this.signalService.hasPurchased(signalId).toPromise();

        if (!response.data && response.success) { this.router.navigate(['/signals']); return false; };

        if (response.data === false && response.success === false) { this.router.navigate(['/profile', response.message], { queryParams: { signal: signalId } }); return false; };

        return true;
    }
}
