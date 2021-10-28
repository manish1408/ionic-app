import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Sell } from '../_models/sell';
import { AuthenticationService } from '../_services/authentication.service';
import { EventService } from '../_services/event.service';
import { SignalService } from '../_services/signal.service';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.page.html',
  styleUrls: ['./sell.page.scss'],
})
export class SellPage implements OnInit {
  user: any;

  loading = false;
  step = 1;
  isDark = false;

  sell: Sell = {
    buy: undefined,
    companyId: undefined,
    description: undefined,
    scheduleAt: undefined,
    isFree: undefined,
    documents: [],
    exchange: undefined,
    isDefault: true,
    isPartOfSubscription: false,
    isPremium: false,
    price: {
      currencyCode: 'USD',
      value: undefined,
      asString: undefined
    },
    sell: undefined,
    stopLoss: undefined,
    symbol: undefined,
    durationInHours: undefined
  };

  rangeLength = 50;

  scheduleAt: any;
  buyRange;
  sellRange;

  files: File[] = [];

  signalId = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private signalService: SignalService,
    private toastController: ToastController,
    private eventService: EventService<any>
  ) { }

  async ionViewWillEnter() {
    const isOnboarded = await this.authService.isSellOnboarded();
    if (!isOnboarded) {
      this.router.navigate(['/sell-onboard'], { replaceUrl: true });
    }

    this.signalId = this.route.snapshot.queryParams['id'];
    if (this.signalId) {
      this.signalService.getDetail(this.signalId).subscribe(m => {
        if (m.success) {
          this.sell.symbol = m.data.symbol;
          this.sell.exchange = m.data.exchange;
          this.buyRange = m.data.trade.buy;
          this.sellRange = m.data.trade.sell;
          this.sell.stopLoss = m.data.trade.stopLoss;
          this.sell.durationInHours = m.data.durationInHours;
          this.sell.description = m.data.description;
          this.sell.price = m.data.price;
          if (this.user && this.user?.defaultSellingPrice) {
            this.sell.isDefault = this.user?.defaultSellingPrice.value === this.sell.price.value;
          }
          this.sell.isPartOfSubscription = m.data.isPartOfSubscription;
          this.sell.isPremium = m.data.isPremium;
          var date = new Date(m.data.scheduleAt);
          this.scheduleAt = date.toISOString();
          this.sell.companyId = m.data.companyId;
        }

      });
    } else {
      this.setScheduleDateTime();
    }

  }

  setScheduleDateTime() {
    const date = new Date();
    this.scheduleAt = date.toISOString();
  }

  async ngOnInit() {
    this.user = await this.authService.getUser();

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
      this.isDark = true;
    }

    if (this.user && this.user?.defaultSellingPrice) {
      this.sell.price = this.user?.defaultSellingPrice;
    }

    if (this.user && this.user.companyId) {
      this.sell.companyId = this.user.companyId;
    }
  }

  clear() {
    this.sell = {
      buy: undefined,
      companyId: undefined,
      description: undefined,
      documents: [],
      exchange: undefined,
      isDefault: false,
      isPartOfSubscription: false,
      isFree: false,
      isPremium: false,
      price: {
        currencyCode: 'USD',
        value: undefined,
        asString: undefined
      },
      sell: undefined,
      stopLoss: undefined,
      symbol: undefined,
      durationInHours: undefined,
      scheduleAt: undefined
    }
    this.setScheduleDateTime();
    this.files = [];
    this.loading = false;
    if (this.user && this.user?.defaultSellingPrice) {
      this.sell.price = this.user?.defaultSellingPrice;
    }
  }

  upload(files) {
    this.files = [...files];
  }

  cancel() {
    this.step = 1;
  }

  async validateStep1() {
    let isError = false;
    let errorMessage = '';
    if (!this.sell.symbol) {
      errorMessage = 'Enter coint pair to continue';
      isError = true;
    } else if (!this.sell.exchange) {
      errorMessage = 'Enter exchange to continue';
      isError = true;
    } else if (!this.buyRange) {
      errorMessage = 'Enter buy range to continue';
      isError = true;
    } else if (!this.sellRange) {
      errorMessage = 'Enter sell range to continue';
      isError = true;
    } else if (!this.sell.stopLoss) {
      errorMessage = 'Enter stop loss to continue';
      isError = true;
    } else if (!this.sell.durationInHours || this.sell.durationInHours < 1) {
      errorMessage = 'Please provice value for time in hours';
      isError = true;
    } else if (this.sell.durationInHours > 96) {
      errorMessage = 'Duration hours cannot be more than 96 hours';
      isError = true;
    }


    if (isError) {
      const toast = await this.toastController.create({
        message: errorMessage,
        duration: 1000,
        color: 'danger',
        position: 'top',
        cssClass: 'custom-toast'
      });
      toast.present();
      return;
    } else {
      this.step = 2;
    }

  }

  createSignal() {
    if (!this.loading) {
      this.loading = true;
      this.sell.documents = this.files;

      this.sell.buy = this.buyRange;
      this.sell.sell = this.sellRange;

      this.sell.isFree = this.sell.price.value === 0;
      this.sell.scheduleAt = this.scheduleAt;

      if (this.signalId) {
        this.signalService.update(this.signalId, this.sell)
          .pipe(finalize(() => this.loading = false))
          .subscribe(async (x) => {
            if (x.success) {
              if (this.sell.isDefault) {
                this.user.defaultSellingPrice = this.sell.price;
                this.authService.setUserDetails$(this.user);
              }
              this.eventService.dispatchEvent('RELOAD_SIGNALS');
              const toast = await this.toastController.create({
                message: 'UPDATED SUCCESSFULLY',
                duration: 1000,
                color: 'success',
                position: 'top',
                cssClass: 'custom-toast'
              });
              toast.present();
            } else {
              const toast = await this.toastController.create({
                message: x.message.toUpperCase(),
                duration: 1000,
                color: 'danger',
                position: 'top',
                cssClass: 'custom-toast'
              });
              toast.present();
            }
          });
      } else {
        this.signalService.sell(this.sell)
          .pipe(finalize(() => this.loading = false))
          .subscribe(async (x) => {
            if (x.success) {
              if (this.sell.isDefault) {
                this.user.defaultSellingPrice = this.sell.price;
                this.authService.setUserDetails$(this.user);
              }
              this.step = 3;
              this.clear();
              this.eventService.dispatchEvent('RELOAD_SIGNALS');
            } else {
              const toast = await this.toastController.create({
                message: x.message,
                duration: 1000,
                color: 'danger',
                position: 'top',
                cssClass: 'custom-toast'
              });
              toast.present();
            }
          });
      }

    }
  }

  onPriceChange($event) {
    this.sell.isDefault = Number.parseFloat(this.sell.price.value.toString()) !== 0;
  }

  sendToSignals() {
    this.router.navigate(['/tabs/signals'], { replaceUrl: true });
  }

  handleBuyRangeInput($event) {
    if ($event.keyCode !== 8) {
      if ($event.key === '-' || $event.key === '.' || /^[0-9]$/i.test($event.key)) {
        if (this.buyRange && $event.key === '-' && this.buyRange.indexOf($event.key) > -1) {
          if (this.buyRange && this.buyRange.indexOf($event.key) > -1) {
            $event.preventDefault();
          }
        }
        // else if ($event.key === '.') {
        //   if (this.buyRange && this.buyRange.indexOf($event.key) > -1) {
        //     $event.preventDefault();
        //   } else if (!this.buyRange || this.buyRange.toString().length < 1) {
        //     $event.preventDefault();
        //   }
        // } 
        else if (this.buyRange && this.buyRange.toString().length <= this.rangeLength) {
          const split = this.buyRange.toString().split('.');
          if (split.length > 1 && split[1].length >= 16) {
            $event.preventDefault();
          }
        }
      } else {
        $event.preventDefault();
      }
    }
  }

  handleSellRangeInput($event) {
    if ($event.keyCode !== 8) {
      if ($event.key === '-' || $event.key === '.' || /^[0-9]$/i.test($event.key)) {
        if (this.sellRange && $event.key === '-' && this.sellRange.indexOf($event.key) > -1) {
          if (this.sellRange && this.sellRange.indexOf($event.key) > -1) {
            $event.preventDefault();
          }
        } else if ($event.key === '.') {
          if (this.sellRange && this.sellRange.indexOf($event.key) > -1) {
            $event.preventDefault();
          } else if (!this.sellRange || this.sellRange.toString().length < 1) {
            $event.preventDefault();
          }
        } else if (this.sellRange && this.sellRange.toString().length <= this.rangeLength) {
          const split = this.sellRange.toString().split('.');
          if (split.length > 1 && split[1].length >= 16) {
            $event.preventDefault();
          }
        }
      } else {
        $event.preventDefault();
      }
    }
  }

  selectTime() {

  }

  get isDefaultDisabled() {
    return Number.parseFloat(this.sell.price.value.toString()) < 1;
  }

}
