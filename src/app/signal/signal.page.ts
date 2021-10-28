import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommentModel } from '../_models/commentModel';
import { SignalModel } from '../_models/signalModel';
import { AuthenticationService } from '../_services/authentication.service';
import { EventService } from '../_services/event.service';
import { SignalService } from '../_services/signal.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-signal',
  templateUrl: './signal.page.html',
  styleUrls: ['./signal.page.scss'],
})
export class SignalPage implements OnInit, OnDestroy {

  favorited = false;
  favoriteUrl = '../../assets/functional/favorite/icons8-star.svg';

  empty = false;
  loading = false;
  buy = 0;
  sell = 0;
  stopLoss = 0;
  current = 2700;
  env = environment;
  signal: SignalModel;
  comment: CommentModel = new CommentModel();
  isPostingComment = false;
  isDark = false;
  user: any;
  rating = -1;
  isRatingSubmitting = false;
  isActivationInProcess = false;
  destroy$ = new Subject<any>();

  constructor(
    private signalService: SignalService,
    private toastController: ToastController,
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingController: LoadingController,
    private eventService: EventService<any>,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
      this.isDark = true;
    }

    this.authService.getUser().then(m => {
      this.comment.companyId = m.companyId;
      this.comment.userId = m.id;
      this.user = m;
    });

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params.id) {
        this.comment.signalId = params.id;
        this.load(params.id);
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  onRatingChange(rating) {

    if (this.isRatingSubmitting) return;
    this.isRatingSubmitting = true;

    this.signalService.rate(this.signal.id, rating)
      .pipe(finalize(() => this.isRatingSubmitting = false),
        takeUntil(this.destroy$))
      .subscribe(ret => {
        if (ret.success) {
          this.eventService.dispatchEvent('RELOAD_SIGNALS');
        }
      });
    // do your stuff
  }

  async load(id: string) {

    this.empty = false;
    this.loading = true;

    this.signalService.getDetail(id).pipe(takeUntil(this.destroy$)).subscribe(m => {
      this.loading = false;
      if (m.success) {
        this.signal = m.data;
        console.log(this.signal);

        this.favorited = this.isUserFavorite;
        if (!this.favorited) {
          this.favoriteUrl = '../../assets/functional/favorite/icons8-star.svg';
        } else {
          this.favoriteUrl = '../../assets/functional/favorite/icons8-star-filled.svg';
        }

        this.buy = this.signal?.trade.buy;
        this.sell = this.signal?.trade.sell;
        this.stopLoss = this.signal?.trade.stopLoss;

        if (this.signal?.comments.length > 0) {
          this.empty = false;
        } else {
          this.empty = true;
        }

      }
    });
  }

  async favorite() {
    if (this.favorited) {
      await this.signalService.unfavorite(this.signal.id).toPromise();
      this.favorited = false;
      this.favoriteUrl = '../../assets/functional/favorite/icons8-star.svg';
      this.eventService.dispatchEvent('RELOAD_SIGNALS');
    } else {
      await this.signalService.favorite(this.signal.id).toPromise();
      this.favorited = true;
      this.favoriteUrl = '../../assets/functional/favorite/icons8-star-filled.svg';
      this.eventService.dispatchEvent('RELOAD_SIGNALS');
    }
  }

  async leaveComment() {
    if (this.isPostingComment) return;
    this.isPostingComment = true;
    if (!this.comment.value || !this.comment.value.trim()) {
      const toast = await this.toastController.create({
        message: 'Enter a comment to continue',
        duration: 1000,
        color: 'primary',
        position: 'top',
        cssClass: 'custom-toast'
      });
      toast.present();
      this.isPostingComment = false;
    } else {
      try {
        const commentRet = await this.signalService.comment(this.comment).toPromise();
        this.isPostingComment = false;
        this.eventService.dispatchEvent('RELOAD_SIGNALS');
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

        this.signal.comments.unshift(commentRet.data);

        if (this.signal?.comments.length > 0) {
          this.empty = false;
        } else {
          this.empty = true;
        }

        this.comment.value = '';
      } catch (error) {
        this.isPostingComment = false;
      }
    }
  }

  get isUserFavorite() {
    return this.signal && this.signal.favoritedUserIds.indexOf(this.user.id) > -1;
  }

  async toggleActivation() {
    if (this.isActivationInProcess) return;

    if (this.signal.isSelected) await this.deactive();
    if (!this.signal.isSelected) await this.activate();
  }

  async activate() {
    if (this.signal.isSelected) return;
    this.isActivationInProcess = true;

    this.signalService.activate(this.signal.id)
      .pipe(finalize(() => this.isActivationInProcess = false),
        takeUntil(this.destroy$))
      .subscribe(async (m) => {
        if (m.success) {
          this.eventService.dispatchEvent('RELOAD_SIGNALS');
          this.signal.isSelected = true;
        } else {
          const toast = await this.toastController.create({
            message: m.message,
            duration: 1000,
            color: 'primary',
            position: 'top',
            cssClass: 'custom-toast'
          });
          toast.present();
        }
      });
  }

  async deactive() {
    if (!this.signal.isSelected) return;
    this.isActivationInProcess = true;

    this.signalService.deactive(this.signal.id)
      .pipe(finalize(() => this.isActivationInProcess = false),
        takeUntil(this.destroy$))
      .subscribe(async (m) => {
        if (m.success) {
          this.eventService.dispatchEvent('RELOAD_SIGNALS');
          this.signal.isSelected = false;
        } else {
          const toast = await this.toastController.create({
            message: m.message,
            duration: 1000,
            color: 'primary',
            position: 'top',
            cssClass: 'custom-toast'
          });
          toast.present();
        }
      });
  }

  async delete() {
    this.signalService.delete(this.signal.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.eventService.dispatchEvent('RELOAD_SIGNALS');
        this.router.navigate(['/signals']);
      })
  }

  async options() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Signal options',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Help',
          handler: () => {
            this.router.navigate(['/help']);
          }
        },
        {
          text: 'Edit',
          handler: () => {
            this.router.navigate(['/sell'], { queryParams: { id: this.signal.id } });
          }
        }, {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await this.delete();
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });
    await actionSheet.present();
  }
}
