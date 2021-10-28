import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';
import { EventService } from '../_services/event.service';
import { SignalService } from '../_services/signal.service';
import { SubscriptionService } from '../_services/subscription.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit, OnDestroy {

  loading = false;
  isSellOnboarded = false;
  signals: any;
  totalCount = 0;
  id = '';

  subscription: any;
  destroyed$ = new Subject<void>();

  prevSearch = '';
  search = '';

  filterTags = [
    { value: 1, name: 'Purchased' },
    { value: 2, name: 'Active' },
    { value: 3, name: 'Highest Profit' },
    { value: 4, name: 'Highest Accuracy' },
    { value: 5, name: 'Free' },
    { value: 6, name: 'New' },
    { value: 7, name: 'Most Purchased' }
  ]

  appliedTags = [];

  timeout: any;

  constructor(
    private router: Router,
    private signalService: SignalService,
    private authService: AuthenticationService,
    private subscriptionService: SubscriptionService,
    private eventService: EventService<any>,
    private activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.activatedRoute.params.subscribe(async (m) => {
      if (m.id && m.id !== this.id) {
        this.id = m.id;
        this.subscriptionService.getDetail(this.id).subscribe(x => {
          this.subscription = x.data;
        })
        this.initialize();
        this.isSellOnboarded = await this.authService.isSellOnboarded();
        await this.loadSignals(false, true);
      }
    })

  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  refresh() {
    if (this.prevSearch !== this.search) {
      this.prevSearch = this.search;
      this.loadSignals(false, true);
    }
  }

  initialize() {
    this.eventService.events
      .pipe(takeUntil(this.destroyed$))
      .subscribe(event => {
        if (this.id && event && event === 'RELOAD_SIGNALS') {
          this.loadSignals(false, false);
        }
      });
  }

  async loadSignals(append, showLoading: boolean) {
    if (showLoading) {
      this.loading = true;
    }

    const params = {
      page: 1,
      count: 50,
      search: this.prevSearch,
      tags: this.appliedTags,
      subscriptionId: this.id
    }

    const response = await this.signalService.get(params).toPromise();

    this.loading = false;

    if (response.success) {
      if (append) {
        this.signals.push(response.data);
      } else {
        this.totalCount = response.totalCount;
        this.signals = [...response.data];
      }
    }
  }

  async ionViewWillEnter() {
    this.isSellOnboarded = await this.authService.isSellOnboarded();
  }

  sendToSell() {
    if (!this.isSellOnboarded) {
      this.router.navigate(['/sell-onboard']);
    } else {
      this.router.navigate(['/sell']);
    }
  }

  getSubscriptionPrice(signal, type) {
    if (signal && signal.subsciptionPrices && signal.subsciptionPrices[type]) {
      return signal.subsciptionPrices[type];
    }
    return null;
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

    this.timeout = setTimeout(() => { this.loadSignals(false, true); }, 1000)
  }
}
