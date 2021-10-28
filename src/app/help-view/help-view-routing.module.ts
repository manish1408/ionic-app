import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpViewPage } from './help-view.page';

const routes: Routes = [
  {
    path: '',
    component: HelpViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpViewPageRoutingModule {}
