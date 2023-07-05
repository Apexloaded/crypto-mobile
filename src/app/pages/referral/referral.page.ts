import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Clipboard } from '@capacitor/clipboard';
import { errorResponse } from 'src/app/interface';
import {
  UtilitiesService,
  AuthService,
  ReferralService,
} from 'src/app/services';
import { EnvironmentService } from 'src/app/services/environment.service';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.page.html',
  styleUrls: ['./referral.page.scss'],
})
export class ReferralPage implements OnInit {
  public refId: string;
  public refLink;
  public account: any;
  public isLoading = true;
  public error: errorResponse | undefined;

  constructor(
    private router: Router,
    private utilService: UtilitiesService,
    private referral: ReferralService,
    private authService: AuthService,
    private env: EnvironmentService
  ) {
    const hostname = env.environment.hostname;
    const user = this.authService.getUser();
    this.refId = user.ref_id;
    this.refLink = `${hostname}?ref=${this.refId}`;
  }

  ngOnInit() {
    this.defineError();
  }

  ionViewWillEnter() {
    const user = this.authService.getUser();
    this.referral
      .recordRetrieve(`?user_id=${user.id}`)
      .then((res) => {
        this.isLoading = false;
        this.account = res?.data;
      })
      .catch((error) => {
        console.log(error);
        this.isLoading = false;
        if (error.name === 'HttpErrorResponse') {
          this.error = {
            title: 'An error occured',
            icon: 'alert-circle-outline',
            msg: 'We could not reach the server',
          };
          return;
        }
        this.utilService.presentToast(error.message, 3000);
      });
  }

  public back() {
    this.router.navigateByUrl('/home');
  }

  public async copy(text?: string) {
    await Clipboard.write({
      string: text,
    });
    this.utilService.presentToast('Transaction ID Copied', 3000);
  }

  public defineError() {
    this.error = {
      title: '',
      icon: '',
      msg: '',
    };
  }

  public withdraw(account: any) {
    this.utilService.presentLoading('circles').then(() => {
      const data = {
        amount: account.current_earning,
        user_id: account.customer_id,
      };
      this.referral
        .withdrawEarnings(data)
        .then((res) => {
          this.utilService.dismisLoadCtrl();
          this.utilService.presentToast(res?.message, 3000);
        })
        .catch((error) => {
          this.utilService.dismisLoadCtrl();
          if (error.name === 'HttpErrorResponse' && error.status == 0) {
            this.utilService.presentToast('Error from our end', 3000);
            return;
          }
          this.utilService.presentToast(error.message, 3000);
        });
    });
  }
}
