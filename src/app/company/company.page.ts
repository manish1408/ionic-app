import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Chart, registerables } from 'chart.js';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';
import { EventService } from '../_services/event.service';
import { ProfileService } from '../_services/profile.service';
import { SignalService } from '../_services/signal.service';
import { SubscriptionService } from '../_services/subscription.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {

  profile: any;
  loading = true;
  isPurchasingSubscription = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private eventService: EventService<any>,
    private toastController: ToastController,
    private subscriptionService: SubscriptionService) { }


  async ngOnInit() {
    this.route.params.subscribe(async (m) => {
      await this.loadData(m.id);
    });
  }

  async loadData(id) {
    this.loading = true;
    if (id) {
      this.profileService.getCompanyProfile(id)
        .pipe(finalize(() => this.loading = false))
        .subscribe(async (x) => {
          this.profile = x.data;
        });
    }
  }

  async buySubscription() {
    if (this.isPurchasingSubscription) return;
    this.isPurchasingSubscription = true;

    this.subscriptionService.purchase(this.profile.subscriptionId)
      .pipe(finalize(() => this.isPurchasingSubscription = false))
      .subscribe(async (result) => {
        if (result.success) {
          this.profile.hasPurchasedSubscription = true;
          this.eventService.dispatchEvent('RELOAD_SIGNALS');
          this.eventService.dispatchEvent('RELOAD_SUBSCRIPTIONS');
          this.router.navigate(['/subscription', this.profile.subscriptionId]);
        } else {
          const toast = await this.toastController.create({
            message: result.message,
            duration: 1000,
            color: 'danger',
            position: 'top',
            cssClass: 'custom-toast'
          });
          toast.present();
        }
      });
  }

  async unsubscribe() {

    if (this.isPurchasingSubscription) return;

    this.isPurchasingSubscription = true;

    this.subscriptionService.unsubscribe(this.profile.subscriptionId)
      .pipe(finalize(() => this.isPurchasingSubscription = false))
      .subscribe(result => {
        if (result.success) {
          this.profile.hasPurchasedSubscription = false;
          this.eventService.dispatchEvent('RELOAD_SIGNALS');
          this.eventService.dispatchEvent('RELOAD_SUBSCRIPTIONS');
        }
      });
  }

}
