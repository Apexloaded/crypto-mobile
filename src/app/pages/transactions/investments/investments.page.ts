import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, errorResponse } from 'src/app/interface';
import { InvestmentAccountInterface } from 'src/app/interface/investment-account.interface';
import { TransactionInterface } from 'src/app/interface/transaction.interface';
import { AuthService, TransactionService, UtilitiesService } from 'src/app/services';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.page.html',
  styleUrls: ['./investments.page.scss'],
})
export class InvestmentsPage implements OnInit {

  public user: User;
  public transactions: Array<TransactionInterface> = [];
  public investmentAccount?: InvestmentAccountInterface;

  public isLoading = true;
  public queryType: string;
  public error: errorResponse | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private txService: TransactionService,
    private utilService: UtilitiesService
  ) { 
    this.queryType = 'credit';
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    this.defineError();
  }

  ionViewWillEnter() {
    this.user = this.authService.getUser();
    this.txService.recordRetrieve(`?user_id=${this.user.id}&type=${this.queryType}`)
    .then(res => {
      this.isLoading = false;
      this.investmentAccount = res?.data.account;
      this.transactions = res?.data.transactions;
    })
    .catch(error => {
      this.isLoading = false;
      if(error.name === 'HttpErrorResponse') {
        this.error = {
          title: 'An error occured',
          icon: 'alert-circle-outline',
          msg: 'We could not reach the server'
        }
        return;
      }
      this.utilService.presentToast(error.message, 3000);
    })
  }

  public addTrade():void {
    this.router.navigateByUrl('/deposit');
  }

  public viewHistory():void {
    this.router.navigateByUrl('/transactions');
  }

  public defineError() {
    this.error = {
      title: '',
      icon: '',
      msg: ''
    }
  }

}
