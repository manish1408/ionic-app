import { BSSLChartComponent } from './../_components/BSSLChart/BSSLChart.component';
import { BSSLChartModule } from './../_components/BSSLChart/BSSLChart.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonProgressBar } from '@ionic/angular';
import { NumericDirective } from '../_directives/numeric.directive';
import { ButtonSpinnerDirective } from '../_directives/button-spinner.directive';
import { TimeAgoExtPipe } from '../_pipes/timeAgo.pipe';
import { NgxSvgModule } from 'ngx-svg';
import { SignalListComponent } from '../_components/signal-list/signal-list.component';
import { IonicRatingComponent, IonicRatingComponentModule } from 'ionic-rating-component';
import { RouterModule } from '@angular/router';
import { ExpirationProgressBarDirective } from '../_directives/expiration-progress-bar.directive';
import { SignalDurationPipe } from '../_pipes/signal-duration.pipe';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule,
        NgxSvgModule,
        IonicRatingComponentModule
    ],
    declarations: [
        NumericDirective,
        ButtonSpinnerDirective,
        ExpirationProgressBarDirective,
        TimeAgoExtPipe,
        SignalDurationPipe,
        BSSLChartComponent,
        SignalListComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        IonicModule,
        NumericDirective,
        ButtonSpinnerDirective,
        ExpirationProgressBarDirective,
        TimeAgoExtPipe,
        SignalDurationPipe,
        NgxSvgModule,
        BSSLChartComponent,
        IonicRatingComponent,
        SignalListComponent
    ]
})
export class SharedModule { }
