import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-BSSLChart',
  templateUrl: './BSSLChart.component.html',
  styleUrls: ['./BSSLChart.component.scss']
})
export class BSSLChartComponent implements OnInit, OnChanges {

  @Input() stopLoss: number;
  @Input() buyPrice: number;
  @Input() sellPrice: number;
  @Input() currentPrice: number;

  isDark = false;
  width: number = 0;
  height: number = 0;

  passive = '#808c9f';
  baseline = '#808c9f50';
  red = '#f6465d';
  green = '#2ebd85';
  white = '#ffffff';
  black = '#000000';
  blue = '#0081fb';
  yellow = '#f1b90c';

  baselineX0: number = 0;
  baselineX1: number = 0;
  baselineY: number = 20;

  indicatorY = this.baselineY;
  indicatorX0: number = 0;
  indicatorX1: number = 0;
  indicatorColor = this.white;


  levelDiameter = 12;

  levelY: number = 0;
  valueY: number = 10;
  labelY: number = 60;

  levelStopLossX: number = 0;
  labelStopLossX: number = 0;
  valueStopLossX: number = 0;
  valueStopLoss: number = 0;


  levelSellX: number = 0;
  labelSellPriceX: number = 0;
  valueSellX: number = 0
  valueSell: number = 0;

  levelBuyX: number = 0;
  labelBuyPriceX: number = 0;
  valueBuyX: number = 0;
  valueBuy: number = 0;


  labelCurrentPriceX: number = 0;
  valueCurrentX: number = 0;
  valueCurrent: number = 0;
  colorCurrent = '#fff';


  rightArrowX: number = 0;
  rightArrowEnable = false;
  leftArrowX: number = 0;
  leftArrowEnable = false;

  constructor(
    private platform: Platform
  ) {

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (!prefersDark.matches) {
      this.white = this.black;
      this.baseline = '#0081fb50';
    }

    platform.ready().then(() => {
      this.width = platform.width() - 32;
      this.height = platform.height();
      this.renderChart(this.stopLoss, this.buyPrice, this.sellPrice, this.currentPrice);
    });
  }

  ngOnInit() {
    
  }

  renderChart(stopLoss, buy, sell, current) {

    //let base = 16;
    let levelMargins = 35;

    this.valueStopLoss = stopLoss;
    this.valueBuy = buy;
    this.valueSell = sell;
    this.valueCurrent = current;

    this.baselineX0 = 0;
    this.baselineX1 = this.width;
    this.levelY = 14;

    //Stop Loss 
    this.levelStopLossX = levelMargins;
    this.labelStopLossX = this.levelStopLossX - 16;
    this.valueStopLossX = this.levelStopLossX - 16;

    //Sell 
    this.levelSellX = this.width - 16 - 35;
    this.labelSellPriceX = this.levelSellX - 24;
    this.valueSellX = this.levelSellX - 16;

    if (current < buy) {

      //Buy 
      this.levelBuyX = (this.width / 2) - (16 / 2) + 40;
      this.labelBuyPriceX = this.levelBuyX - 20;
      this.valueBuyX = this.levelBuyX - 12;

      this.indicatorColor = this.red;
      this.indicatorX0 = this.levelBuyX;
      this.indicatorX1 = this.levelStopLossX + 100;
      this.leftArrowX = this.indicatorX1 - 12;
      this.leftArrowEnable = true;

      this.labelCurrentPriceX = this.leftArrowX - 24;
      this.valueCurrentX = this.leftArrowX - 12;
      this.colorCurrent = this.red;
    }

    if (current > buy) {

      this.levelBuyX = (this.width / 2) - (16 / 2) - 45;
      this.labelBuyPriceX = this.levelBuyX - 20;
      this.valueBuyX = this.levelBuyX - 12;

      this.indicatorColor = this.green;
      this.indicatorX0 = this.levelBuyX;
      this.indicatorX1 = this.levelSellX - 90;
      this.rightArrowX = this.indicatorX1 - 12;
      this.rightArrowEnable = true;
      this.labelCurrentPriceX = this.rightArrowX - 24;
      this.valueCurrentX = this.rightArrowX - 12;
      this.colorCurrent = this.green;
    }
  }

  ngOnChanges(changes) {
    let changed = false;

    if (changes?.buyPrice) {
      this.buyPrice = changes?.buyPrice?.currentValue;
      changed = true;
    }

    if (changes?.sellPrice) {
      this.sellPrice = changes?.sellPrice?.currentValue;
      changed = true;
    }

    if (changes?.stopLoss) {
      this.stopLoss = changes?.stopLoss?.currentValue;
      changed = true;
    }

    if (changed) {
      this.renderChart(this.stopLoss, this.buyPrice, this.sellPrice, this.currentPrice);
    }
  }
}
