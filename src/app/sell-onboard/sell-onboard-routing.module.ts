import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellOnboardPage } from './sell-onboard.page';

const routes: Routes = [
  {
    path: '',
    component: SellOnboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellOnboardPageRoutingModule {}
