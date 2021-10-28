import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventService } from './_services/event.service';
import { SharedService } from './_services/shared.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './_interceptors/token.interceptor';
import { SharedModule } from './shared/shared.module';
import { TransporterService } from './_services/transporter.service';
import { ExpirationProgressBarDirective } from './_directives/expiration-progress-bar.directive';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    EventService,
    SharedService,
    TransporterService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy, },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule { }
