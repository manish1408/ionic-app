import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyingAdvantagesPageRoutingModule } from './buying-advantages-routing.module';

import { BuyingAdvantagesPage } from './buying-advantages.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuyingAdvantagesPageRoutingModule
  ],
  declarations: [BuyingAdvantagesPage]
})
export class BuyingAdvantagesPageModule {}
