import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompliancePage } from './compliance.page';

const routes: Routes = [
  {
    path: '',
    component: CompliancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompliancePageRoutingModule {}
