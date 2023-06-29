import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interface';
import { UtilitiesService, AuthService, WalletService } from 'src/app/services';
import { PreviousRouteService } from 'src/app/services/previous-route.service';

@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.page.html',
  styleUrls: ['./withdrawal.page.scss'],
})
export class WithdrawalPage implements OnInit {
  public withdrawalForm: FormGroup = this.buildForm();
  public previousRoute: string = '/home';
  public routeArray: Array<any> = [];
  public user: User | undefined;

  constructor(
    private router: Router,
    private prevRoute: PreviousRouteService,
    private utilServices: UtilitiesService,
    private fb: FormBuilder,
    private authService: AuthService,
    private wallet: WalletService
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.buildForm();
    if (this.user)
      this.withdrawalForm.controls['user_id'].setValue(this.user.id);
  }

  ionViewWillEnter() {
    this.previousRoute = this.prevRoute.getPreviousRoute;
    this.routeArray.push(this.previousRoute);
    this.previousRoute = this.routeArray[0];
  }

  private buildForm() {
    return this.fb.group({
      amount: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      sector: new FormControl('INVESTMENT', {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      payment_method: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      currency: new FormControl('USD', {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      user_id: new FormControl(null, {
        validators: [Validators.required],
      }),
      otp: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
    });
  }

  public back(): void {
    const checkPrev = (route: string) => {
      const isWithdrawalRoute = route.includes('/withdrawal');
      return isWithdrawalRoute ? '/home' : route;
    };
    const route = this.previousRoute ? checkPrev(this.previousRoute) : '/home';
    this.router.navigateByUrl(`${route}`);
  }

  public viewHistory(): void {
    this.router.navigateByUrl('/transactions');
  }

  public requestOTP(): void {
    this.utilServices.presentLoading('circles').then(() => {
      this.authService.requestOTP().subscribe(
        (res) => {
          this.utilServices.dismisLoadCtrl();
          this.utilServices.presentToast(res.message, 3000);
        },
        (error) => {
          this.utilServices.dismisLoadCtrl();
          this.utilServices.presentToast(error.message, 3000);
        }
      );
    });
  }

  public initWithdrawal() {
    if (!this.withdrawalForm.valid) {
      this.utilServices.presentToast('Fill in all required input', 3000);
      return;
    }
    const data = {
      amount: this.withdrawalForm.controls['amount'].value,
      currency: this.withdrawalForm.controls['currency'].value,
      sector: this.withdrawalForm.controls['sector'].value,
      payment_method: this.withdrawalForm.controls['payment_method'].value,
      user_id: this.withdrawalForm.controls['user_id'].value,
      otp: this.withdrawalForm.controls['otp'].value,
    };

    this.utilServices.presentLoading('circles').then(() => {
      this.wallet
        .initWithdraw(data)
        .then((res) => {
          this.utilServices.dismisLoadCtrl();
          this.withdrawalForm.reset();
          this.utilServices.presentToast(
            'You have successfully initiated a withdrawal',
            3000
          );
          this.router.navigateByUrl(`transactions/details/${res?.data.id}`);
        })
        .catch((error) => {
          this.utilServices.dismisLoadCtrl();
          if (error.name === 'HttpErrorResponse' && error.status == 0) {
            this.utilServices.presentToast('Error from our end', 3000);
            return;
          }
          this.utilServices.presentToast(error.message, 3000);
        });
    });
  }
}
