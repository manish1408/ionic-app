import { SharedService } from 'src/app/_services/shared.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { EventService } from '../_services/event.service';
import { get, remove, set } from '../_services/storage.service';
import { AccountService } from '../_services/account.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  version = '';
  build = '';
  mode = '';

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private router: Router,
    private accountService: AccountService,
    private eventService: EventService<any>,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.version = environment.version;
    this.build = environment.build;
    this.mode = environment.mode;
  }

  async signOut() {
    const alert = await this.alertController.create({
      header: 'Sign Out',
      message: '<strong>Are you sure you want sign out?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelled sign out');
          }
        }, {
          text: 'OK',
          handler: () => {
            this.clearStoredData();
            this.navCtrl.setDirection('root');
            this.router.navigate(['/authentication']);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteAccount() {
    const alert = await this.alertController.create({
      header: 'Delete Account',
      message: '<strong>Are you sure you want to delete your account?</strong>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancelled delete account');
          }
        }, {
          text: 'OK',
          handler: () => {
            this.accountService.deleteAccount().subscribe((r) => {
              this.clearStoredData();
              this.navCtrl.setDirection('root');
              this.router.navigate(['/authentication']);
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async clearStoredData() {
    remove('token');
    remove('SGNL_USER');
    this.sharedService.token = null;
  }
}
