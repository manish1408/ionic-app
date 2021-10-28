import { Component, OnInit } from '@angular/core';
import { CMSService } from '../_services/cms.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-warnings',
  templateUrl: './warnings.page.html',
  styleUrls: ['./warnings.page.scss'],
})
export class WarningsPage implements OnInit {

  content: string;

  constructor(
    private cmsService: CMSService,
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

    this.cmsService.getWarnings().subscribe((ret) => {
      loading.dismiss();

      if (ret) {
       this.content = ret.items[0].data.value.iv;
      }
    });
  }
  
}
