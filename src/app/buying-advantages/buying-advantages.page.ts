import { Component, OnInit } from '@angular/core';
import { CMSService } from '../_services/cms.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-buying-advantages',
  templateUrl: './buying-advantages.page.html',
  styleUrls: ['./buying-advantages.page.scss'],
})
export class BuyingAdvantagesPage implements OnInit {

  content;
  title: string;
  body: string;

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

    this.cmsService.getAdvantages().subscribe((ret) => {
      loading.dismiss();

      if (ret) {
        this.content = ret.items.find(i => i.data.type.iv === 'buy');
        if(this.content) {
          this.title = this.content.data.title.iv;
          this.body  = this.content.data.body.iv;
        }
      }
    });
  }
}
