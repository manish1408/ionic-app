import { Component, OnInit } from '@angular/core';
import { TransporterService } from '../_services/transporter.service';

@Component({
  selector: 'app-help-view',
  templateUrl: './help-view.page.html',
  styleUrls: ['./help-view.page.scss'],
})
export class HelpViewPage implements OnInit {

  content;
  title = '';
  body = '';

  constructor(
    private transporterService: TransporterService,
  ) { }

  ngOnInit() {
    if(this.transporterService.data) {
      this.content = this.transporterService.data.data;
      this.title = this.content.title.iv;
      this.body = this.content.body.iv;
    }
  }

}
