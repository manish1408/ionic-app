import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';
import { EventService } from '../_services/event.service';
import { SignalService } from '../_services/signal.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-signals',
  templateUrl: './signals.page.html',
  styleUrls: ['./signals.page.scss'],
  providers: []
})
export class SignalsPage implements OnInit {

  loading = false;
  empty = false;
  isSellOnboarded = false;
  signals: any;
  totalCount = 0;

  prevSearch = '';
  search = '';

  timeout: any;

  filterTags = [
    { value: 0, name: 'Selected' },
    { value: 2, name: 'In Progress' },
    { value: 1, name: 'Purchased' },
    { value: 3, name: 'Highest Profit' },
    { value: 4, name: 'Highest Accuracy' },
    { value: 5, name: 'Free' },
    { value: 6, name: 'New' },
    { value: 8, name: 'Owned' },
    { value: 9, name: 'Expired' }
  ]

  appliedTags = [];

  destroyed$ = new Subject<void>();

  page = 1;
  count = 10;

  constructor(
    private router: Router,
    private signalService: SignalService,
    private authService: AuthenticationService,
    private eventService: EventService<any>
  ) { }


  async ngOnInit() {
    this.initialize();
    this.isSellOnboarded = await this.authService.isSellOnboarded();
    //this.appliedTags.push(2);
    await this.loadSignals(false, true);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  initialize() {
    this.eventService.events
      .pipe(takeUntil(this.destroyed$))
      .subscribe(event => {
        if (event && event === 'RELOAD_SIGNALS') {
          this.loadSignals(false, false);
        }
      });
  }

  async loadData(event) {
    await this.loadSignals(true, false, event);
  }

  async loadSignals(append, showLoading: boolean, infiniteScrollEvent = undefined) {

    this.empty = false;

    if (showLoading) {
      this.loading = true;
    }

    if (append) { this.page++; }
    else {
      this.page = 1;
    }

    const params = {
      page: this.page,
      count: this.count,
      search: this.prevSearch,
      tags: this.appliedTags
    }

    this.signalService.get(params)
      .pipe(takeUntil(this.destroyed$),
        finalize(() => {
          this.loading = false;
          if (infiniteScrollEvent) {
            infiniteScrollEvent.target.complete();
            infiniteScrollEvent.target.disabled = this.signals.length >= this.totalCount;
          }
        }))
      .subscribe(response => {

        if (response.success) {
          if (append) {
            response.data.forEach(element => {
              this.signals.push(element);
            });
          } else {
            this.totalCount = response.totalCount;
            this.signals = [...response.data];

            if (this.signals.length > 0) {
              this.empty = false;
            } else {
              this.empty = true;
            }
          }
        }
      });

  }

  async ionViewWillEnter() {
    this.isSellOnboarded = await this.authService.isSellOnboarded();
  }

  sendToSell() {
    this.router.navigate(['/sell']);
    // if (!this.isSellOnboarded) {
    //   this.router.navigate(['/sell-onboard']);
    // } else {
    //   this.router.navigate(['/sell']);
    // }
  }

  refresh() {
    if (this.prevSearch !== this.search) {
      this.prevSearch = this.search;
      this.loadSignals(false, true);
    }
  }

  applyTag(tagValue) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    const index = this.appliedTags.indexOf(tagValue);

    if (index > -1) {
      this.appliedTags.splice(index, 1);
    } else {
      this.appliedTags.push(tagValue);
    }

    Haptics.impact({ style: ImpactStyle.Heavy });

    this.timeout = setTimeout(() => { this.loadSignals(false, true); }, 1000)
  }

  async doRefresh(event) {

    const params = {
      page: 1,
      count: this.page * this.count,
      search: this.prevSearch,
      tags: this.appliedTags
    }

    this.signalService.get(params)
      .pipe(finalize(() => event.target.complete()),
        takeUntil(this.destroyed$))
      .subscribe(response => {
        if (response.success) {
          this.signals = [...response.data];
          this.totalCount = response.totalCount;
        }
      });
  }
}

