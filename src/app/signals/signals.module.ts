import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignalsPageRoutingModule } from './signals-routing.module';

import { SignalsPage } from './signals.page';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    SharedModule,
    SignalsPageRoutingModule
  ],
  declarations: [
    SignalsPage
  ],
  providers: [
  ]
})
export class SignalsPageModule { }
