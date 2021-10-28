import { CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { EventService } from '../_services/event.service';
import { SubscriptionService } from '../_services/subscription.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.page.html',
  styleUrls: ['./subscriptions.page.scss'],
  providers: [CurrencyPipe]
})
export class SubscriptionsPage implements OnInit, OnDestroy {

  env = environment;

  subscriptions: any;

  destroyed$ = new Subject<void>();

  page = 1;
  count = 20;

  prevSearch = '';
  search = '';

  loading = false;

  totalCount = 0;

  filterTags = [
    // { value: 0, name: 'Selected' },
    { value: 1, name: 'Purchased' },
    { value: 2, name: 'In Progress' },
    { value: 3, name: 'Highest Profit' },
    { value: 4, name: 'Highest Accuracy' },
    { value: 5, name: 'Free' },
    { value: 6, name: 'New' },
    // { value: 7, name: 'Most Purchased' },
    { value: 8, name: 'Owned' }
  ]

  appliedTags = [];
  timeout: any;

  constructor(private subscriptionService: SubscriptionService,
    private currencyPipe: CurrencyPipe,
    private eventService: EventService<any>) { }

  ngOnInit() {
    this.loadSubscriptions();

    this.eventService.events
      .pipe(takeUntil(this.destroyed$))
      .subscribe(event => {
        if (event && event === 'RELOAD_SUBSCRIPTIONS') {
          this.refresh();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  async loadData(event) {
    await this.loadSubscriptions(true, event);
  }

  loadSubscriptions(append = false, infiniteScrollEvent = undefined) {
    this.loading = !append;

    if (append) { this.page++; }
    else { this.page = 1 };

    const params = {
      page: this.page,
      count: this.count,
      search: this.prevSearch,
      tags: this.appliedTags
    }

    this.subscriptionService.get(params)
      .pipe(finalize(() => this.loading = false))
      .subscribe(response => {
        if (append) {
          response.data.forEach(element => {
            this.subscriptions.push(element);
          });

          if (infiniteScrollEvent) {
            infiniteScrollEvent.target.complete();
            infiniteScrollEvent.target.disabled = this.subscriptions.length >= this.totalCount;
          }
        } else {
          this.subscriptions = [...response.data];
          this.totalCount = response.totalCount;
        }
      });
  }

  refresh() {
    this.prevSearch = this.search;
    this.page = 1;
    this.loadSubscriptions(false);
  }

  getSubscriptionPrice(subscription) {
    let prices = [];

    for (let key in subscription.prices) {
      const price = subscription.prices[key];
      const prefix = key === 'Monthly' ? 'MO' : 'WK';
      prices.push(this.currencyPipe.transform(price?.value, price?.currencyCode) + '/' + prefix);
    }

    return prices.join(' OR ');
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

    this.timeout = setTimeout(() => { this.page = 1; this.loadSubscriptions(false); }, 1000)
  }

  async doPullRefresh(event) {
    const params = {
      page: 1,
      count: this.page * this.count,
      search: this.prevSearch,
      tags: this.appliedTags
    }

    const response = await this.subscriptionService.get(params).toPromise();

    if (response.success) {
      this.subscriptions = [...response.data];
    }

    event.target.complete();
  }

}
