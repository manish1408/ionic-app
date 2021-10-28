import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcknowledgePageRoutingModule } from './acknowledge-routing.module';

import { AcknowledgePage } from './acknowledge.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcknowledgePageRoutingModule
  ],
  declarations: [AcknowledgePage]
})
export class AcknowledgePageModule {}
