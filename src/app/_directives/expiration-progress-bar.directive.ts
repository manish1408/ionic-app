import { ChangeDetectorRef, Directive, ElementRef, Input, NgZone, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appExpirationProgressBar]'
})
export class ExpirationProgressBarDirective implements OnInit, OnDestroy {

  changeDetectorRef: ChangeDetectorRef;
  ngZone: NgZone;
  timer: any;

  _startDate;
  _endDate;
  _today;

  @Input() set start(value) {
    this._startDate = +new Date(value);
  }
  @Input() set expiry(value) {
    if (value)
      this._endDate = +new Date(value);
  }
  @Input() hasExpired = false;


  constructor(private elem: ElementRef, changeDetectorRef: ChangeDetectorRef, ngZone: NgZone) {
    this.changeDetectorRef = changeDetectorRef;
    this.ngZone = ngZone;
  }

  ngOnInit(): void {

    if (this.hasExpired) {
      this.elem.nativeElement.innerHTML = ` <ion-progress-bar value="1" buffer="0.5"></ion-progress-bar>`;
    } else if (!this._startDate || !this._endDate) {
      this.elem.nativeElement.innerHTML = ` <ion-progress-bar value="0" buffer="0.5"></ion-progress-bar>`;
    } else {
      this._today = +new Date().getTime();
      if (this._today < this._startDate) {
        this.elem.nativeElement.innerHTML = ` <ion-progress-bar value="0" buffer="0.5"></ion-progress-bar>`;
      } else if (this._today > this._endDate) {
        this.elem.nativeElement.innerHTML = ` <ion-progress-bar value="1" buffer="0.5"></ion-progress-bar>`;
      } else {
        this.timer = setInterval(() => {
          this.initializeUX();
        }, 5000);
        this.initializeUX();
      }
    }
  }

  initializeUX() {
    this._today = +new Date();
    let totalTime = this._endDate - this._startDate;
    let currentTime = this._today - this._startDate;
    let p = currentTime / totalTime;
    //console.log(p > 1 ? 1 : p < 0.05 ? 0.05 : p);
    this.elem.nativeElement.innerHTML = ` <ion-progress-bar value="${p > 1 ? 1 : p < 0.05 ? 0.05 : p}" buffer="0.5"></ion-progress-bar>`;
    this._today = null;
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
