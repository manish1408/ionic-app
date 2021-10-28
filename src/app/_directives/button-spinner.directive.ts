import { Directive, ElementRef, Input, OnChanges, OnInit } from '@angular/core';

@Directive({
  selector: '[appButtonSpinner]'
})
export class ButtonSpinnerDirective implements OnInit, OnChanges {

  @Input() loadingState: boolean;
  @Input() text: string;
  @Input() loadingText: string = 'Loading';

  constructor(private elem: ElementRef) {
    if (this.elem.nativeElement.innerText) {
      this.text = this.elem.nativeElement.innerText;
    }
  }

  ngOnInit(): void {
    if (this.loadingState) {
      this.elem.nativeElement.innerHTML = `<ion-spinner name="crescent"></ion-spinner>`;
    }
  }

  ngOnChanges(changes) {
    this.loadingState = changes.loadingState?.currentValue;
    if (this.loadingState) {
      this.elem.nativeElement.innerHTML = `<ion-spinner name="crescent"></ion-spinner>`;
    } else {
      if (this.text) {
        this.elem.nativeElement.innerText = this.text;
      }
    }
  }
}