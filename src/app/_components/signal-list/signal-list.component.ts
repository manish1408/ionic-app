import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signal-list',
  templateUrl: './signal-list.component.html',
  styleUrls: ['./signal-list.component.scss'],
})
export class SignalListComponent implements OnInit {

  @Input() signals: any;
  env = environment;

  constructor() { }

  ngOnInit() {
    //console.log(this.signals);
  }

  getSubscriptionPrice(signal, type) {
    if (signal && signal.subsciptionPrices && signal.subsciptionPrices[type]) {
      return signal.subsciptionPrices[type];
    }
    return null;
  }
}
