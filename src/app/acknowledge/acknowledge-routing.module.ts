import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcknowledgePage } from './acknowledge.page';

const routes: Routes = [
  {
    path: '',
    component: AcknowledgePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcknowledgePageRoutingModule {}
