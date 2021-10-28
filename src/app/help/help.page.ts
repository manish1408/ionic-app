import { Component, OnInit } from '@angular/core';
import { CMSService } from '../_services/cms.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TransporterService } from '../_services/transporter.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  data;
  loaded = false;

  constructor(
    private cmsService: CMSService,
    private router: Router,
    private transporterService: TransporterService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.load();
  }

  async load() {
    const loading = await this.loadingController.create({
      cssClass: 'loading',
      spinner: 'crescent',
      message: '',
      duration: 0
    });
    await loading.present();

    this.cmsService.getHelp().subscribe((ret) => {
      this.loaded = true;
      loading.dismiss();

      if (ret) {
        this.data = ret.items;
      }
    });
  }

  getByCategory(category: string) {
    return this.data.filter(x => x.data.category.iv === category);
  }

  open(item) {
    this.transporterService.data = item;
    this.router.navigate(['/help-view']);
  }
}
