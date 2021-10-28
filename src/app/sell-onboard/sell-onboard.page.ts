import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AccountService } from '../_services/account.service';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-sell-onboard',
  templateUrl: './sell-onboard.page.html',
  styleUrls: ['./sell-onboard.page.scss'],
})
export class SellOnboardPage implements OnInit {

  enableWeeklyPrice = false;
  enableMonthlyPrice = false;
  enableCompany = false;

  weeklyPrice: number;
  monthlyPrice: number;
  companyName: string;
  companyDescription: string;

  isSaving = false;

  isOnboarded = false;
  returnUrl = '';

  constructor(
    private accountService: AccountService,
    private toastController: ToastController,
    private authService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams && queryParams.returnUrl) {
      this.returnUrl = queryParams.returnUrl;
    }
  }

  async confirm() {
    if (!this.isSaving) {
      this.isSaving = true;
      const payload = {
        companyName: this.companyName,
        bio: this.companyDescription
      };

      if (this.enableMonthlyPrice) {
        payload['monthlyPrice'] = this.monthlyPrice;
      }

      if (this.enableWeeklyPrice) {
        payload['weeklyPrice'] = this.weeklyPrice;
      }

      const response = await this.accountService.onboardSell(payload).toPromise();

      if (response.success) {
        this.authService.setUserDetails$(response.data);

        if (this.returnUrl) {
          this.router.navigate(['/' + this.returnUrl]);
        } else {
          this.router.navigate(['/signals']);
        }
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

  sendToSignals() {
    this.router.navigate(['/tabs/signals'], { replaceUrl: true });
  }
}
