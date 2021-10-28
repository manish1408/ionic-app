import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { LoadingController, ToastController } from '@ionic/angular';
import { AccountService } from '../_services/account.service';
import { NotificationSettingsModel } from '../_models/notificationSettingsModel';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.page.html',
  styleUrls: ['./notification-settings.page.scss'],
})
export class NotificationSettingsPage implements OnInit {

  notifications: NotificationSettingsModel = new NotificationSettingsModel();
  loaded = false;

  data;
  message = '';
  loading = false;

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
    this.accountService.get().subscribe((r) => {
      this.data = r.data;
      this.notifications = this.data.notificationSettings;
      if (!this.notifications) {
        this.notifications = {
          "enabledOn": [],
          "newSignal": false,
          "superSignal": false,
          "signalSale": false,
          "subscriptionSale": false,
          "signalComment": false
        };
      }
    });
  }

  async save() {
    if (this.notifications) {
      this.accountService.updateNotifications(this.notifications).subscribe(async (ret) => {
        if (!ret && !ret.data) {
          const toast = await this.toastController.create({
            message: 'Account not saved successfully. Try again later.',
            duration: 1000,
            color: 'danger',
            position: 'top',
            cssClass: 'custom-toast'
          });
          toast.present();
        }
      });
    }
  }
}
