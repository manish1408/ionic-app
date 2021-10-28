import { Pipe, PipeTransform, NgZone, ChangeDetectorRef, OnDestroy } from '@angular/core';

@Pipe({
    name: 'duration',
    pure: false
})
export class SignalDurationPipe implements PipeTransform, OnDestroy {
    changeDetectorRef: ChangeDetectorRef;
    ngZone: NgZone;
    timer: any;
    _hasExpired = false;

    constructor(changeDetectorRef: ChangeDetectorRef, ngZone: NgZone) {
        this.changeDetectorRef = changeDetectorRef;
        this.ngZone = ngZone;
    }

    ngOnDestroy() {
        this.removeTimer();
    }

    transform(value: any, hasExpired: any): any {
        this._hasExpired = hasExpired;

        this.removeTimer();
        const d = new Date(value);
        const now = new Date();
        const hasStarted = now.getTime() > d.getTime();
        let seconds = 0;

        if (hasExpired) {
            seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
        } else {
            if (hasStarted) {
                seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
            } else {
                seconds = Math.round(Math.abs((d.getTime() - now.getTime()) / 1000));
            }
        }

        const timeToUpdate = (Number.isNaN(seconds)) ? 1000 : this.getSecondsUntilUpdate(seconds) * 1000;
        this.timer = this.ngZone.runOutsideAngular(() => {
            if (typeof window !== 'undefined') {
                return window.setTimeout(() => {
                    this.ngZone.run(() => this.changeDetectorRef.markForCheck());
                }, timeToUpdate);
            }
            return null;
        });
        const minutes = Math.round(Math.abs(seconds / 60));
        const hours = Math.round(Math.abs(minutes / 60));
        const days = Math.round(Math.abs(hours / 24));
        const months = Math.round(Math.abs(days / 30.416));
        const years = Math.round(Math.abs(days / 365));
        if (Number.isNaN(seconds)) {
            return '';
        } else if (seconds <= 45) {
            return `${this.getPreText(hasStarted)} few secs ${this.getSuffixText(hasStarted)}`.trim();
        } else if (seconds <= 90) {
            return `${this.getPreText(hasStarted)} min ${this.getSuffixText(hasStarted)}`.trim();
        } else if (minutes <= 45) {
            return `${this.getPreText(hasStarted)} ${minutes} ${this.getSuffixText(hasStarted)}`.trim();
        } else if (minutes <= 90) {
            return `${this.getPreText(hasStarted)} an hr ${this.getSuffixText(hasStarted)}`.trim();
        } else if (hours <= 22) {
            return `${this.getPreText(hasStarted)} ${hours} hrs ${this.getSuffixText(hasStarted)}`.trim();
        } else if (hours <= 36) {
            return `${this.getPreText(hasStarted)} a day ${this.getSuffixText(hasStarted)}`.trim();
        } else if (days <= 25) {
            return `${this.getPreText(hasStarted)} ${days} days ${this.getSuffixText(hasStarted)}`.trim();
        } else if (days <= 45) {
            return `${this.getPreText(hasStarted)} a month ${this.getSuffixText(hasStarted)}`.trim();
        } else if (days <= 345) {
            return `${this.getPreText(hasStarted)} ${months} months ${this.getSuffixText(hasStarted)}`.trim();
        } else if (days <= 545) {
            return `${this.getPreText(hasStarted)} a year ${this.getSuffixText(hasStarted)}`.trim();
        } else {
            // (days > 545)
            return `${this.getPreText(hasStarted)} ${years} yrs ${this.getSuffixText(hasStarted)}`.trim();
        }
    }

    removeTimer() {
        if (this.timer) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
    }

    getPreText(hasStarted) {
        return this._hasExpired ? 'EXPIRED' : hasStarted ? 'STARTED' : 'STARTS IN';
    }

    getSuffixText(hasStarted) {
        return this._hasExpired ? 'ago' : hasStarted ? 'ago' : '';
    }

    getSecondsUntilUpdate(seconds) {
        const min = 60;
        const hr = min * 60;
        const day = hr * 24;

        if (seconds < min) {
            // less than 1 min, update every 2 secs
            return 2;
        } else if (seconds < hr) {
            // less than an hour, update every 30 secs
            return 30;
        } else if (seconds < day) {
            // less then a day, update every 5 mins
            return 300;
        } else {
            // update every hour
            return 3600;
        }
    }
}