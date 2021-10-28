import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SellOnboardPageRoutingModule } from './sell-onboard-routing.module';

import { SellOnboardPage } from './sell-onboard.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    SellOnboardPageRoutingModule
  ],
  declarations: [SellOnboardPage]
})
export class SellOnboardPageModule { }
