import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WalletService } from '../_services/wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit, OnDestroy {

  withdrawRequested = false;
  balance = 0;

  destroy$ = new Subject<void>();

  constructor(private walletService: WalletService) { }

  ngOnInit() {
    this.walletService.getBalance()
      .pipe(takeUntil(this.destroy$))
      .subscribe(m => {
        this.balance = m.data;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  requestWithdraw() {
    this.withdrawRequested = true;
  }

  cancelWithdrawRequest() {
    this.withdrawRequested = false;
  }

}
