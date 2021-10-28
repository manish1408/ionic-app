import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubscriptionSettingsPage } from './subscription-settings.page';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionSettingsPageRoutingModule {}
