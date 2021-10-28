import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingController, ToastController } from '@ionic/angular';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-company-settings',
  templateUrl: './company-settings.page.html',
  styleUrls: ['./company-settings.page.scss'],
})
export class CompanySettingsPage implements OnInit {

  url;
  message = '';
  loading = false;
  companyInfo = {
    "name": '',
    "description": '',
    "websiteLink": ''
  };

  constructor(
    private sanitizer: DomSanitizer,
    private toastController: ToastController,
    private accountService: AccountService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.load();
  }

  async load() {
    this.accountService.getCompanyInfo().subscribe((r) => {
      this.companyInfo = r.data;
      if (!this.companyInfo) {
        this.companyInfo = {
          "name": '',
          "description": '',
          "websiteLink": ''
        };
      }
    });
  }

  async save() {
    if (this.companyInfo) {
      this.loading = true;
      this.accountService.updateCompany(this.companyInfo).subscribe(async (ret) => {
        if (ret && ret.data) {
          const toast = await this.toastController.create({
            message: 'Account saved successfully.',
            duration: 1000,
            color: 'success',
            position: 'top',
            cssClass: 'custom-toast'
          });
          toast.present();
        } else {
          const toast = await this.toastController.create({
            message: 'Account not saved successfully. Try again later.',
            duration: 1000,
            color: 'danger',
            position: 'top',
            cssClass: 'custom-toast'
          });
          toast.present();
        }
        this.loading = false;
      });
    }
  }

}
