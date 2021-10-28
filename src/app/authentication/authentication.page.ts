import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { AuthenticationService } from '../_services/authentication.service';
import { GenericService } from '../_services/generic.service';
import { SharedService } from '../_services/shared.service';
import { environment } from 'src/environments/environment';
import { get, set } from '../_services/storage.service';
import { ServerResponse } from '../_models/server-response';
import { AccountService } from '../_services/account.service';


@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss'],
})
export class AuthenticationPage implements OnInit {

  darkMode = 'light';
  mode = 'email';
  confirmMode = false;
  value = '';
  code = '';
  loading = false;
  token = '';

  version = '';
  build = '';
  type = '';
  countryCode = '';

  constructor(
    public toastController: ToastController,
    private router: Router,
    private navController: NavController,
    private authenticationService: AuthenticationService,
    private accountService: AccountService,
    private sharedService: SharedService,
    private genericService: GenericService
  ) { }

  ngOnInit() {



    this.version = environment.version;
    this.build = environment.build;
    this.type = environment.mode;

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.darkMode = 'dark';
    }
    this.loadCountryCode();
  }

  async switchMode(event) {
    if (this.mode === 'email') {
      this.value = '';
    } else {
      this.value = this.countryCode + '';
    }

  }

  async continue() {
    if (!this.value) {
      let errorMessage = '';
      if (this.mode === 'email') {
        errorMessage = 'Enter your email address to continue';
      } else {
        errorMessage = 'Enter your mobile number to continue';
      }
      const toast = await this.toastController.create({
        message: errorMessage,
        duration: 1000,
        color: 'danger',
        position: 'top',
        cssClass: 'custom-toast'
      });
      toast.present();
      return;
    }

    this.loading = true;

    this.authenticationService.validate(this.value, this.mode).subscribe(async (ret) => {
      this.loading = false;
      if (ret) {
        this.confirmMode = true;
      } else {
        const toast = await this.toastController.create({
          message: 'Your confirmation code has not been send successfully',
          duration: 1000,
          color: 'danger',
          position: 'top',
          cssClass: 'custom-toast'
        });
        toast.present();
      }
    });
  }

  async confirm() {
    if (!this.code) {
      const toast = await this.toastController.create({
        message: 'Enter your code to continue',
        duration: 1000,
        color: 'danger',
        position: 'top',
        cssClass: 'custom-toast'
      });
      toast.present();
      return;
    }

    this.loading = true;
    this.authenticationService.signin(this.value, this.code, this.mode).subscribe(async (ret) => {
      this.loading = false;

      if (ret && ret.success && ret.data) {
        const confirmation: ServerResponse<string> = ret;
        if (confirmation.success) {
          this.navController.setDirection('root');
          set('token', confirmation.data);
          this.sharedService.token = confirmation.data;

          await this.loadUser();
        } else {
          this.router.navigate(['/intro']);
        }
      } else {
        const toast = await this.toastController.create({
          message: 'Your confirmation code is wrong. ' + ret.message,
          duration: 1000,
          color: 'danger',
          position: 'top',
          cssClass: 'custom-toast'
        });
        toast.present();
      }
    });
  }

  async loadCountryCode() {
    this.genericService.getCountryCode().subscribe((ret) => {
      if (ret && ret.success) {
        this.countryCode = ret.data;
      }
    });
  }

  async cancel() {
    this.confirmMode = false;
    this.clearAll();
  }

  private clearAll() {
    this.value = '';
    this.code = '';
  }

  async loadUser() {
    this.accountService.get()
      .subscribe(async (m) => {
        await this.authenticationService.setUserDetails$(m.data);
        this.router.navigate(['/tabs/home']);
      });
  }

  async confirmationChange() {
    if (this.code.length === 6) {
      this.confirm();
    }
  }

}
