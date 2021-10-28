import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { SharedService } from 'src/app/_services/shared.service';
import { SignalService } from '../_services/signal.service';
import { get } from '../_services/storage.service';
import { SubscriptionService } from '../_services/subscription.service';


@Injectable({
    providedIn: 'root',
})
export class SubscriptionGuard implements CanActivate {
    constructor(
        private router: Router,
        private subscriptionService: SubscriptionService,
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

        const subscriptionId = next.params.id;

        if (!subscriptionId) return false;

        const response = await this.subscriptionService.hasPurchased(subscriptionId).toPromise();

        if (!response.data && response.success) { this.router.navigate(['/subscriptions']); return false; };

        if (response.data === false && response.success === false) { this.router.navigate(['/profile', response.message]); return false; };

        return true;
    }
}
