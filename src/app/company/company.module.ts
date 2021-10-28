import { NgModule } from '@angular/core';
import { CompanyPageRoutingModule } from './company-routing.module';
import { CompanyPage } from './company.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    CompanyPageRoutingModule
  ],
  declarations: [CompanyPage]
})
export class CompanyPageModule { }
