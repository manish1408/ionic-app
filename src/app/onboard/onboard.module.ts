import { NgModule } from '@angular/core';
import { OnboardPageRoutingModule } from './onboard-routing.module';

import { OnboardPage } from './onboard.page';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    SharedModule,
    OnboardPageRoutingModule
  ],
  declarations: [OnboardPage]
})
export class OnboardPageModule { }
