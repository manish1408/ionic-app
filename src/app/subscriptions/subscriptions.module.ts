import { NgModule } from '@angular/core';
import { SubscriptionsPageRoutingModule } from './subscriptions-routing.module';
import { SubscriptionsPage } from './subscriptions.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    SubscriptionsPageRoutingModule
  ],
  declarations: [SubscriptionsPage]
})
export class SubscriptionsPageModule {}
