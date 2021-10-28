import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { CommentModel } from '../_models/commentModel';
import { AuthenticationService } from '../_services/authentication.service';
import { ProfileService } from '../_services/profile.service';
import { SignalService } from '../_services/signal.service';
import { SubscriptionService } from '../_services/subscription.service';
import { Chart, registerables } from "chart.js";
import { EventService } from '../_services/event.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @ViewChild("lineCanvas") lineCanvas: ElementRef;

  lineChart: Chart;

  empty = false;
  comment: CommentModel = new CommentModel();
  isPostingComment = false;
  profile: any;
  loading = true;
  env = environment;
  signalPricing: any;

  signalId: string = '';

  isPurchasingSignal = false;
  isPurchasingSubscription = false;
  hideSignalPriceSection = false;
  chartLoaded = false;


  constructor(private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private profileService: ProfileService,
    private signalService: SignalService,
    private eventService: EventService<any>,
    private subscriptionService: SubscriptionService) { }

  async ngOnInit() {

    Chart.register(...registerables);

    this.route.params.subscribe(async (m) => {
      await this.loadData(m.id);
    });
  }

  async loadData(id) {
    this.loading = true;
    if (id) {
      this.profileService.getUserProfile(id)
        .pipe(finalize(() => this.loading = false))
        .subscribe(async (x) => {
          this.profile = x.data;
          if (this.profile.comments.length > 0) {
            this.empty = false;
          } else {
            this.empty = true;
          }

          setTimeout(() => {
            this.loadChart();
          }, 50);

        });

      this.authService.getUser().then(k => {
        this.comment.userId = k.id;
        this.comment.profileId = id;
      });
    }

    if (this.route.snapshot.queryParams.signal) {
      this.signalId = this.route.snapshot.queryParams.signal;
      const signalPricing = await this.signalService.getPricing(this.signalId).toPromise();
      this.signalPricing = signalPricing.data;
    }
  }

  ngAfterViewInit() {

  }

  async loadChart() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "HIT",
            fill: false,
            tension: 0.3,
            backgroundColor: "#2ebd8550",
            borderColor: "#2ebd85",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "#2ebd85",
            pointBackgroundColor: "#f6465d",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#2ebd85",
            pointHoverBorderColor: "#2ebd85",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [0, 0, 0, 81, 56, 55, 40, 22, 3, 23, 14, 45],
            spanGaps: false
          },
          {
            label: "MISS",
            fill: false,
            tension: 0.3,
            backgroundColor: "#f6465d50",
            borderColor: "#f6465d",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "#f6465d",
            pointBackgroundColor: "#f6465d",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#f6465d",
            pointHoverBorderColor: "#f6465d",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [0, 0, 0, 11, 21, 44, 16, 12, 2, 4, 20, 2],
            spanGaps: false
          },
          {
            label: "SENTIMENT",
            fill: false,
            tension: 0.3,
            backgroundColor: "#f1b90c50",
            borderColor: "#f1b90c",
            borderCapStyle: "butt",
            borderDash: [5, 5],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "#f1b90c",
            pointBackgroundColor: "#f1b90c",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#f1b90c",
            pointHoverBorderColor: "#f1b90c",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [0, 0, 0, 60, 75, 65, 48, 90, 66, 48, 78, 87],
            spanGaps: false
          },
        ]
      }
    });
  }

  async postComment() {

    if (this.isPostingComment) return;

    this.isPostingComment = true;

    if (!this.comment.value || !this.comment.value.trim()) {

      const toast = await this.toastController.create({
        message: 'Enter a comment to continue',
        duration: 1000,
        color: 'danger',
        position: 'top',
        cssClass: 'custom-toast'
      });
      toast.present();
      this.isPostingComment = false;

    } else {

      try {

        const commentRet = await this.profileService.comment(this.comment).toPromise();
        this.isPostingComment = false;

        if (!commentRet.success) {
          const toast = await this.toastController.create({
            message: commentRet.message,
            duration: 1000,
            color: 'primary',
            position: 'top',
            cssClass: 'custom-toast'
          });
          toast.present();
          return;
        }

        this.profile.comments.unshift(commentRet.data);
        this.comment.value = '';

        if (this.profile.comments.length > 0) {
          this.empty = false;
        } else {
          this.empty = true;
        }
      } catch (error) {
        this.isPostingComment = false;
      }

    }
  }

  async buySignal() {

    if (this.isPurchasingSignal || this.isPurchasingSubscription) return;

    this.isPurchasingSignal = true;

    this.signalService.purchase(this.signalId)
      .pipe(finalize(() => this.isPurchasingSignal = false))
      .subscribe(async (result) => {
        if (result.success) {
          this.signalPricing.hasPurchased = true;
          this.eventService.dispatchEvent('RELOAD_SIGNALS');
          if (this.signalId) {
            this.router.navigate(['/signal', this.signalId]);
          }
        } else {
          const toast = await this.toastController.create({
            message: result.message,
            duration: 1000,
            color: 'danger',
            position: 'top',
            cssClass: 'custom-toast'
          });
          toast.present();
        }
      });
  }

  async buySubscription() {

    if (this.isPurchasingSignal || this.isPurchasingSubscription) return;

    this.isPurchasingSubscription = true;

    this.subscriptionService.purchase(this.profile.subscriptionId)
      .pipe(finalize(() => this.isPurchasingSubscription = false))
      .subscribe(async (result) => {
        if (result.success) {
          this.profile.hasSubscribed = true;
          this.eventService.dispatchEvent('RELOAD_SIGNALS');
          this.eventService.dispatchEvent('RELOAD_SUBSCRIPTIONS');
          if (this.signalId) {
            this.router.navigate(['/signal', this.signalId]);
          }
        } else {
          const toast = await this.toastController.create({
            message: result.message,
            duration: 1000,
            color: 'danger',
            position: 'top',
            cssClass: 'custom-toast'
          });
          toast.present();
        }
      });
  }

  async unsubscribe() {

    if (this.isPurchasingSignal || this.isPurchasingSubscription) return;

    this.isPurchasingSubscription = true;

    this.subscriptionService.unsubscribe(this.profile.subscriptionId)
      .pipe(finalize(() => this.isPurchasingSubscription = false))
      .subscribe(result => {
        if (result.success) {
          this.profile.hasSubscribed = false;
          if (this.signalPricing?.isPartOfSubscription && !this.signalPricing?.hasPurchasedSeparately) {
            this.signalPricing.hasPurchased = false;
          }
          this.eventService.dispatchEvent('RELOAD_SIGNALS');
          this.eventService.dispatchEvent('RELOAD_SUBSCRIPTIONS');
        }
      });
  }

}
