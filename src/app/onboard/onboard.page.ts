import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { AccountService } from '../_services/account.service';
import { AuthenticationService } from '../_services/authentication.service';
import { SharedService } from '../_services/shared.service';
import { get, remove, set } from '../_services/storage.service';

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.page.html',
  styleUrls: ['./onboard.page.scss'],
})
export class OnboardPage implements OnInit {

  isSaving = false;
  url;
  picturePath = '';
  message = '';
  loading = false;

  file: File;

  enableCompany = false;
  companyName = '';
  companyDescription = '';

  model = {
    firstName: '',
    lastName: '',
    username: '',
    companyName: '',
    companyDescription: ''
  }

  @ViewChild('f', { static: true }) form: NgForm;

  constructor(
    private accountService: AccountService,
    private toastController: ToastController,
    private authService: AuthenticationService,
    private sanitizer: DomSanitizer,
    private navCtrl: NavController,
    private sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit() {
    this.picturePath = '../assets/functional/icons8-male-user.svg';
  }

  async onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(this.file);
      reader.onload = async () => {
        const blob: Blob = new Blob([new Uint8Array((reader.result as ArrayBuffer))]);
        const blobURL: string = URL.createObjectURL(blob);
        this.url = this.sanitizer.bypassSecurityTrustUrl(blobURL);
        // this.userService.updatePicture(file).subscribe((ret) => {
        //   this.load();
        // });
      };
    }
  }


  async confirm() {
    if (this.isSaving) return;

    this.isSaving = true;

    const usernameRet = await this.accountService.isUsernameAvailable(this.model.username).pipe(finalize(() => this.isSaving = false)).toPromise();
    this.form.form.controls['userName'].setErrors({})

    if (usernameRet.success) {
      if (!usernameRet.data) {
        this.form.form.controls['userName'].setErrors({ unique: true })
        this.isSaving = false;
        return false;
      }
    } else {
      const toast = await this.toastController.create({
        message: usernameRet.message,
        duration: 1000,
        color: 'danger',
        position: 'top',
        cssClass: 'custom-toast'
      });
      toast.present();
      return false;
    }

    this.model['file'] = this.file;

    const onboardRet = await this.accountService.onboard(this.model).pipe(finalize(() => this.isSaving = false)).toPromise();

    if (onboardRet.success) {
      this.authService.setUserDetails$(onboardRet.data);
      const toast = await this.toastController.create({
        message: 'Account details saved successfully.',
        duration: 1000,
        color: 'success',
        position: 'top',
        cssClass: 'custom-toast'
      });
      toast.present();
      this.router.navigate(['/tabs/home']);
    } else {
      const toast = await this.toastController.create({
        message: onboardRet.message,
        duration: 1000,
        color: 'danger',
        position: 'top',
        cssClass: 'custom-toast'
      });
      toast.present();
      return false;
    }
  }

  async cancel() {
    this.clearStoredData();
    this.navCtrl.setDirection('root');
    this.router.navigate(['/']);
  }

  async clearStoredData() {
    remove('token');
    remove('SGNL_USER');
    this.sharedService.token = null;
  }
  
}
