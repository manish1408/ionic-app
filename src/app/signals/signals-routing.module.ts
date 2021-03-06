import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards/auth.guards';

import { SignalsPage } from './signals.page';

const routes: Routes = [
  {
    path: '',
    component: SignalsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignalsPageRoutingModule { }
