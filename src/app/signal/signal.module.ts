import { NgModule } from '@angular/core';
import { SignalPageRoutingModule } from './signal-routing.module';
import { SignalPage } from './signal.page';
import { SharedModule } from '../shared/shared.module';
import { IonicRatingComponent, IonicRatingComponentModule } from 'ionic-rating-component';

@NgModule({
  imports: [
    SharedModule,
    SignalPageRoutingModule
  ],
  declarations: [SignalPage]
})
export class SignalPageModule { }
