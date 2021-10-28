import { HomeStatsModel } from './../_models/homeStatsModel';
import { CMSService } from './../_services/cms.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AccountService } from '../_services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeService } from '../_services/home.service';
import { forkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../_services/authentication.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  homeStats: HomeStatsModel = new HomeStatsModel();
  isDark = false;
  value = '';
  loading = false;
  inviteEmail = '';
  showSellStats = false;

  destroyed$ = new Subject<void>();


  constructor(
    private cms: CMSService,
    public toastController: ToastController,
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private authService: AuthenticationService,
    private homeService: HomeService
  ) { }

  ngOnInit() {
    this.initialize();

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
      this.isDark = true;
    }

    this.authService.isSellOnboarded().then(r => this.showSellStats = r);
    this.load();
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }

  initialize() {
    this.homeStats.newSignals = 0;
    this.homeStats.superSignal = 0;
    this.homeStats.newTraders = 0;
    this.homeStats.signalsMonitored = 0;
    this.homeStats.signalsSold = 0;
    this.homeStats.subscriptionsSold = 0;
    this.homeStats.hits = 0;
    this.homeStats.misses = 0;
  }

  async load() {
    this.homeService.getNewSignalsCount().pipe(takeUntil(this.destroyed$)).subscribe((r: any) => this.homeStats.newSignals = r.data);
    this.homeService.getSuperSignalsCount().pipe(takeUntil(this.destroyed$)).subscribe((r: any) => this.homeStats.superSignal = r.data);
    this.homeService.getNewTradersCount().pipe(takeUntil(this.destroyed$)).subscribe((r: any) => this.homeStats.newTraders = r.data);
    this.homeService.getMonitoredSignalsCount().pipe(takeUntil(this.destroyed$)).subscribe((r: any) => this.homeStats.signalsMonitored = r.data);
    this.homeService.getSoldSignalsCount().pipe(takeUntil(this.destroyed$)).subscribe((r: any) => this.homeStats.signalsSold = r.data);
    this.homeService.getSoldSubscriptionCount().pipe(takeUntil(this.destroyed$)).subscribe((r: any) => this.homeStats.subscriptionsSold = r.data);
  }

  async invite() {

    if (!this.inviteEmail) {
      const toast = await this.toastController.create({
        message: 'Insert the email address',
        duration: 1000,
        color: 'danger',
        position: 'top',
        cssClass: 'custom-toast'
      });
      toast.present();
      return
    }

    if (!this.validateEmail(this.inviteEmail)) {
      const toast = await this.toastController.create({
        message: 'Insert a valid email address',
        duration: 1000,
        color: 'danger',
        position: 'top',
        cssClass: 'custom-toast'
      });
      toast.present();
      return
    }

    this.loading = true;

    this.accountService.invite({ 'email': this.inviteEmail }).subscribe(async (ret) => {
      this.loading = false;
      if (ret) {
        const toast = await this.toastController.create({
          message: 'Your invitation has been sent successfully',
          duration: 1000,
          color: 'primary',
          position: 'top',
          cssClass: 'custom-toast'
        });
        toast.present();
        this.inviteEmail = '';
      }
    });
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  async doRefresh(event) {

    this.destroyed$.next();

    let requests = [];
    requests.push(this.homeService.getNewSignalsCount());
    requests.push(this.homeService.getSuperSignalsCount());
    requests.push(this.homeService.getNewTradersCount());
    requests.push(this.homeService.getMonitoredSignalsCount());
    requests.push(this.homeService.getSoldSignalsCount());
    requests.push(this.homeService.getSoldSubscriptionCount());

    forkJoin(requests).pipe(
      takeUntil(this.destroyed$),
      finalize(() => event.target.complete()))
      .subscribe((r: any) => {
        this.homeStats.newSignals = r[0].data;
        this.homeStats.superSignal = r[1].data;
        this.homeStats.newTraders = r[2].data;
        this.homeStats.signalsMonitored = r[3].data;
        this.homeStats.signalsSold = r[4].data;
        this.homeStats.subscriptionsSold = r[5].data;
      });
  }


}
