import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlanService, TransactionService, UtilitiesService, WalletService } from 'src/app/services';
import { PreviousRouteService } from 'src/app/services/previous-route.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.page.html',
  styleUrls: ['./deposit.page.scss'],
})
export class DepositPage implements OnInit {

  public previousRoute: string;
  private routeArray: any[] = [];
  public depositForm: FormGroup;
  public userWallet: any;
  public plans: Array<any> = [];
  public selectedPlan: any;

  constructor(
    private router: Router,
    private prevRoute: PreviousRouteService,
    private utilServices: UtilitiesService,
    private fb: FormBuilder,
    private wallet: WalletService,
    private transactionProv: TransactionService,
    private planProvider: PlanService
  ) { 
    this.depositForm = this.buildForm();
    this.previousRoute = '/home';
  }

  ngOnInit() {
    this.buildForm();
  }

  ionViewWillEnter() {
    this.previousRoute = this.prevRoute.getPreviousRoute;
    this.routeArray.push(this.previousRoute);
    this.previousRoute = this.routeArray[0];
    this.userWallet = this.wallet.userWallet;
    this.planProvider.recordRetrieve()
    .then(res => {
      this.plans = res?.data;
    }).catch(err => {
      console.log(err);
    })
  }

  public handleOnChange(event: any) {
    const value = event.target.value;
    const plan = this.plans.find(f => f.id == value);
    this.selectedPlan = plan;
  }

  private buildForm() {
    return this.fb.group({
      amount: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      plan: new FormControl(null, {
        updateOn: 'change', 
        validators: [Validators.required],
      }),
      payment_method: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      currency: new FormControl('USD', {
        updateOn: 'change',
        validators: [Validators.required]
      })
    })
  }

  public back():void {
    const checkPrev = (route: string) => {
      const isWithdrawalRoute = route.includes('/deposit');
      return isWithdrawalRoute ? '/home' : route;
    };
    const route = this.previousRoute ? checkPrev(this.previousRoute) : '/home';
    this.router.navigateByUrl(`${route}`);
  }

  public viewHistory():void {
    this.router.navigateByUrl('/transactions');
  }

  public initDeposit() {
    if(!this.depositForm.valid) {
      this.utilServices.presentToast('Fill in all required input', 3000);
      return;
    }

    if(this.selectedPlan && this.depositForm.controls['amount'].value < this.selectedPlan.min_amount) {
      this.utilServices.presentToast(`Your investment amount should not be less than ${this.selectedPlan.min_amount}`, 3000);
      return;
    }

    if(this.selectedPlan && this.depositForm.controls['amount'].value > this.selectedPlan.max_amount) {
      this.utilServices.presentToast(`Your investment amount should not be more than ${this.selectedPlan.max_amount}, kindly choose a higher plan!`, 3000);
      return;
    }

    const data = {
      amount: this.depositForm.controls['amount'].value,
      currency: this.depositForm.controls['currency'].value,
      plan: this.depositForm.controls['plan'].value,
      payment_method: this.depositForm.controls['payment_method'].value,
    };

    this.utilServices.presentLoading('circles')
    .then(el => {
      this.transactionProv.recordCreate(data)
      .then(res => {
        const prop = {
          data,
          ...res?.data
        };
        this.depositForm.reset();
        this.utilServices.dismisLoadCtrl();
        this.utilServices.presentToast(`Your investment is been processed!`, 3000);
      })
      .catch(error => {
        this.utilServices.dismisLoadCtrl();
        if(error.name === 'HttpErrorResponse' && error.status == 0) {
          this.utilServices.presentToast('Error from our end', 3000);
          return;
        }
        this.utilServices.presentToast(error.message, 3000);
      })
    })
  }

}
