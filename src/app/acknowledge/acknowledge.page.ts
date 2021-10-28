import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { AuthenticationService } from '../_services/authentication.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-acknowledge',
  templateUrl: './acknowledge.page.html',
  styleUrls: ['./acknowledge.page.scss'],
})
export class AcknowledgePage implements OnInit {

  constructor(private accountService: AccountService, private router: Router, private authService: AuthenticationService) { }

  acknowledged = false;
  isSubmitting = false;


  ngOnInit() {
  }

  async submitAcknowledgement() {

    if (this.isSubmitting) return;

    this.isSubmitting = true;

    try {
      const response = await this.accountService.submitAcknowledgement().toPromise();

      const user = await this.authService.getUser();
      user.hasAcknowledged = true;
      this.authService.setUserDetails$(user);
      this.router.navigate(['/tabs/home']);
      this.isSubmitting = false;
    } catch (e) {
      this.isSubmitting = false;
    }
  }
}
