import { UserModel } from './../_models/userModel';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { LoadingController, ToastController } from '@ionic/angular';
import { AccountService } from '../_services/account.service';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  url;
  picturePath = '';
  message = '';
  loading = false;
  user: UserModel = new UserModel;

  constructor(
    private sanitizer: DomSanitizer,
    private toastController: ToastController,
    private accountService: AccountService,
    private authService: AuthenticationService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.load();
  }

  async load() {
    this.accountService.get().subscribe((r) => {
      this.user = r.data;
      this.url = this.user?.picture ? `${environment.cdn}profiles/${this.user?.picture}` : '';
    });
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.user.file = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => this.url = reader.result;
    }
  }

  async save() {
    if (this.user) {
      this.loading = true;
      this.accountService.update(this.user).subscribe(async (ret) => {
        if (ret && ret.success) {
          this.authService.setUserDetails$(ret.data);
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
