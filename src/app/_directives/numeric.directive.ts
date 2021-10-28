import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: "[numeric]"
})
export class NumericDirective {

  _decimals: number;

  @Input("decimals") set decimals(val) {
    this._decimals = Number.parseInt(val);
  }
  @Input("negative") negative: number = 0;
  @Input("separator") separator: string = ".";
  @Input("allowDash") allowDash: boolean;

  private checkAllowNegative(value: string) {
    if (this._decimals <= 0) {
      return String(value).match(new RegExp(/^-?\d+$/));
    } else {
      var regExpString =
        "^-?\\s*((\\d+(\\" + this.separator + "\\d{0," +
        this._decimals +
        "})?)|((\\d*(\\" + this.separator + "\\d{1," +
        this._decimals +
        "}))))\\s*$";
      return String(value).match(new RegExp(regExpString));
    }
  }

  private check(value: string) {
    if (this._decimals <= 0 && !this.allowDash) {
      return String(value).match(new RegExp(/^\d+$/));
    } else if (this.decimals <= 0 && this.allowDash) {

    } else {
      var regExpString =
        "^\\s*((\\d+(\\" + this.separator + "\\d{0," +
        this._decimals +
        "})?)|((\\d*(\\" + this.separator + "\\*-*d{1," + this._decimals +
        "}))))\\s*$";
      return String(value).match(new RegExp(regExpString));
    }
  }

  private run(oldValue) {
    setTimeout(() => {
      let currentValue: string = this.el.nativeElement.value;
      let allowNegative = this.negative > 0 ? true : false;

      if (allowNegative) {
        if (
          !["", "-"].includes(currentValue) &&
          !this.checkAllowNegative(currentValue)
        ) {
          this.el.nativeElement.value = oldValue;
        }
      } else {
        if (currentValue !== "" && !this.check(currentValue)) {
          this.el.nativeElement.value = oldValue;
        }
      }
    });
  }

  constructor(private el: ElementRef) { }

  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    this.run(this.el.nativeElement.value);
  }

  @HostListener("paste", ["$event"])
  onPaste(event: ClipboardEvent) {
    this.run(this.el.nativeElement.value);
  }
}