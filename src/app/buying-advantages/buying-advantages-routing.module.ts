import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyingAdvantagesPage } from './buying-advantages.page';

const routes: Routes = [
  {
    path: '',
    component: BuyingAdvantagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyingAdvantagesPageRoutingModule {}
