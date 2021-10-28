import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HelpViewPageRoutingModule } from './help-view-routing.module';

import { HelpViewPage } from './help-view.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelpViewPageRoutingModule
  ],
  declarations: [HelpViewPage]
})
export class HelpViewPageModule {}
