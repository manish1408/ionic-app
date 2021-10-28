import { Component, OnInit } from '@angular/core';
import { CMSService } from '../_services/cms.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-sell-advantages',
  templateUrl: './sell-advantages.page.html',
  styleUrls: ['./sell-advantages.page.scss'],
})
export class SellAdvantagesPage implements OnInit {

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
        this.content = ret.items.find(i => i.data.type.iv === 'sell');
        if(this.content) {
          this.title = this.content.data.title.iv;
          this.body  = this.content.data.body.iv;
        }
      }
    });
  }


}
