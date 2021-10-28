import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AccountService } from '../_services/account.service';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-subscription-settings',
  templateUrl: './subscription-settings.page.html',
  styleUrls: ['./subscription-settings.page.scss'],
})
export class SubscriptionSettingsPage implements OnInit {

  enableWeeklyPrice = false;
  enableMonthlyPrice = false;
  weeklyPrice: number;
  monthlyPrice: number;
  enableCompany = false;
  subscription;
  isSaving = false;

  constructor(
    private accountService: AccountService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.load();
  }

  async load() {
    this.accountService.getSubscription().subscribe((r) => {
      this.subscription = r.data;

      if (r.data.prices) {
        if (r.data.prices?.Monthly) {
          this.enableMonthlyPrice = true;
          this.monthlyPrice = r.data.prices.Monthly.value;
        } else {
          this.enableMonthlyPrice = false;
        }

        if (r.data.prices?.Weekly) {
          this.enableWeeklyPrice = true;
          this.weeklyPrice = r.data.prices.Weekly.value;
        } else {
          this.enableWeeklyPrice = false;
        }
      }
    });
  }

  async save() {
    if (!this.isSaving) {
      this.isSaving = true;
      const payload = {};

      payload['enableWeeklyPrice'] = this.enableWeeklyPrice;
      if (this.enableWeeklyPrice) {
        payload['weeklyPrice'] = this.weeklyPrice;
      } else {
        payload['weeklyPrice'] = null;
      }

      payload['enableMonthlyPrice'] = this.enableMonthlyPrice;
      if (this.enableMonthlyPrice) {
        payload['monthlyPrice'] = this.monthlyPrice;
      } else {
        payload['monthlyPrice'] = null;
      }

      const response = await this.accountService.updateSubscription(payload).toPromise();

      if (response.success) {
        const toast = await this.toastController.create({
          message: "Subscription saved successfully",
          duration: 1000,
          color: 'success',
          position: 'top',
          cssClass: 'custom-toast'
        });
        toast.present();

      } else {
        const toast = await this.toastController.create({
          message: response.message,
          duration: 1000,
          color: 'danger',
          position: 'top',
          cssClass: 'custom-toast'
        });
        toast.present();
      }

      this.isSaving = false;

    }
  }

}
