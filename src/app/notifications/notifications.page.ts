import { AccountService } from './../_services/account.service';
import { Component, OnInit } from '@angular/core';
import { NotificationModel } from '../_models/notificationModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  notifications: any;
  loading = false;
  totalCount = 0;

  page = 1;
  count = 10;

  constructor(
    private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit() {
    this.load(false);
  }

  async load(append, infiniteScrollEvent = undefined) {

    if (!append) {
      this.loading = true;
    }

    if (append) {
      if (this.notifications.length >= this.totalCount) {
        return;
      }
      this.page++;
    }
    else { this.page = 1; }

    const response = await this.accountService.getNotifications(this.page, this.count).toPromise();
    this.loading = false;
    if (response.success) {
      if (append) {
        response.data.forEach(element => {
          this.notifications.push(element);
        });

        if (infiniteScrollEvent) {
          infiniteScrollEvent.target.complete();
          infiniteScrollEvent.target.disabled = this.notifications.length >= this.totalCount;
        }
      } else {
        this.totalCount = response.totalCount;
        this.notifications = [...response.data];
      }
    }
  }

  async doPullRefresh(event) {
    this.page = 1;

    const response = await this.accountService.getNotifications(this.page, this.count).toPromise();

    this.loading = false;
    if (response.success) {
      this.notifications = [...response.data];
    }

    event.target.complete();
  }

  nagivate(url) {
    if (url)
      this.router.navigateByUrl(url);
  }
}
