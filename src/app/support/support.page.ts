import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { GenericService } from '../_services/generic.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.page.html',
  styleUrls: ['./support.page.scss'],
})
export class SupportPage implements OnInit {

  type;
  value = '';
  loading = false;

  constructor(
    private genericService: GenericService,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
    this.value = '';
  }

  async send() {

    if (!this.value) {
      const toast = await this.toastController.create({
        message: 'Enter a support request message to continue.',
        duration: 1000,
        color: 'danger',
        position: 'top',
        cssClass: 'custom-toast'
      });
      toast.present();
      return;
    }
    this.loading = true;
    this.genericService.setSupportRequest(this.type, this.value).subscribe(async (ret) => {
      if (ret) {

        this.value = '';

        const toast = await this.toastController.create({
          message: 'Your support request has been sent successfully',
          duration: 1000,
          color: 'success',
          position: 'top',
          cssClass: 'custom-toast'
        });
        toast.present();
      } else {
        const toast = await this.toastController.create({
          message: 'Your support request has not been sent successfully. Try again later.',
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
