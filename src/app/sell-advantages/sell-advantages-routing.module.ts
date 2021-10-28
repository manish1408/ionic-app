import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellAdvantagesPage } from './sell-advantages.page';

const routes: Routes = [
  {
    path: '',
    component: SellAdvantagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellAdvantagesPageRoutingModule {}
