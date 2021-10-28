import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BSSLChartComponent } from './BSSLChart.component';
import { NgxSvgModule } from 'ngx-svg';

@NgModule({
  imports: [
    CommonModule,
    NgxSvgModule
  ]
})
export class BSSLChartModule { }
