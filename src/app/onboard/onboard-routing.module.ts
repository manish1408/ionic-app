import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards/auth.guards';

import { OnboardPage } from './onboard.page';

const routes: Routes = [
  {
    path: '',
    component: OnboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardPageRoutingModule { }
