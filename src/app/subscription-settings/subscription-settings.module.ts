import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubscriptionSettingsPageRoutingModule } from './subscription-settings-routing.module';

import { SubscriptionSettingsPage } from './subscription-settings.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    SubscriptionSettingsPageRoutingModule
  ],
  declarations: [SubscriptionSettingsPage]
})
export class SubscriptionSettingsPageModule {}
