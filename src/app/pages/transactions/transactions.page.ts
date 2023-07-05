import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { User, errorResponse } from 'src/app/interface';
import { NotificationMessage } from 'src/app/interface/notification-msg.interface';
import {
  AuthService,
  TransactionService,
  UtilitiesService,
} from 'src/app/services';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { IonicSlides } from '@ionic/angular';
import { TransactionInterface } from 'src/app/interface/transaction.interface';
import { InvestmentAccountInterface } from 'src/app/interface/investment-account.interface';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  swiperModules = [IonicSlides];

  private previousRoute: any;
  private routeArray: Array<any> = [];
  public user: User;

  public investmentAccount?: InvestmentAccountInterface;

  public transactions: Array<TransactionInterface> = [];
  public debitTransactions: Array<TransactionInterface> = [];
  public creditTransactions: Array<TransactionInterface> = [];
  public earningTransactions: Array<TransactionInterface> = [];

  public isLoading = true;
  public isFullHeight: boolean;
  public selectedSlides: any;
  public segment = '0';

  public sliderOptions = {
    initialSlide: 0,
    slidesPerView: 1,
    speed: 400,
    direction: 'horizontal',
    centeredSlides: true,
    spaceBetween: 1,
  };

  public notificationMsg: NotificationMessage;

  public error: errorResponse | undefined;

  constructor(
    private router: Router,
    private prevRoute: PreviousRouteService,
    private authService: AuthService,
    private txService: TransactionService,
    private utilService: UtilitiesService
  ) {
    this.notificationMsg = {
      icon: undefined,
      title: undefined,
      msg: undefined,
      btn: {
        url: undefined,
        title: undefined,
      },
    };
    this.user = this.authService.getUser();
    this.isFullHeight = true;
    this.previousRoute = this.prevRoute.getPreviousRoute;
  }

  ngOnInit() {
    this.defineError();
  }

  ionViewWillEnter() {
    this.previousRoute = this.prevRoute.getPreviousRoute;
    this.routeArray.push(this.previousRoute);
    this.previousRoute = this.routeArray[0];
    this.getTransactions();
  }

  public getTransactions() {
    this.user = this.authService.getUser();
    this.txService
      .recordRetrieve(`?user_id=${this.user.id}`)
      .then((res) => {
        this.isLoading = false;
        this.transactions = res?.data.transactions;
        this.investmentAccount = res?.data.account;
        this.filterTransactions();
        //this.defineError();
      })
      .catch((error) => {
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

  public filterTransactions() {
    this.creditTransactions = this.transactions.filter(
      (r) => r.transaction_type === 'CREDIT'
    );
    this.debitTransactions = this.transactions.filter(
      (r) => r.transaction_type === 'DEBIT'
    );
    this.earningTransactions = this.transactions.filter(
      (r) => r.transaction_type === 'EARNING'
    );
  }

  public back(): void {
    const checkPrev = (route: string) => {
      const isWithdrawalRoute = route.includes('/transactions');
      return isWithdrawalRoute ? '/home' : route;
    };
    const route = this.previousRoute ? checkPrev(this.previousRoute) : '/home';
    this.router.navigateByUrl(`${route}`);
  }

  async segmentChanged() {
    this.swiperRef?.nativeElement.swiper.slideTo(this.segment);
  }

  async slidesChange() {
    const selectedIndex = this.swiperRef?.nativeElement.swiper.activeIndex;
    this.segment = selectedIndex ? selectedIndex.toString() : this.segment;
    this.isFullHeight = true;

    switch (this.segment) {
      case '1':
        if (this.creditTransactions.length < 1) {
          this.isFullHeight = true;
          this.notificationMsg.icon = 'alert-circle-outline';
          this.notificationMsg.title = 'No Credits';
          this.notificationMsg.msg = "You haven't credited your account yet";
          this.notificationMsg.btn.url = '/trades/new';
          this.notificationMsg.btn.title = 'Credit Account';
        }
        break;
      case '2':
        if (this.earningTransactions.length < 1) {
          this.isFullHeight = true;
          this.notificationMsg.icon = 'alert-circle-outline';
          this.notificationMsg.title = 'No Earnings';
          this.notificationMsg.msg = 'You currently do not have any earnings';
        }
        break;
      case '3':
        if (this.debitTransactions.length < 1) {
          this.isFullHeight = true;
          this.notificationMsg.icon = 'alert-circle-outline';
          this.notificationMsg.title = 'No Withdrawals';
          this.notificationMsg.msg =
            "You haven't made any withdrawals on your account";
        }
        break;
      default:
        if (this.transactions.length < 1) {
          this.isFullHeight = true;
          this.notificationMsg.icon = 'alert-circle-outline';
          this.notificationMsg.title = 'No Transaction';
          this.notificationMsg.msg = "You haven't made a transaction yet";
          this.notificationMsg.btn.url = '/trades/new';
          this.notificationMsg.btn.title = 'Deposit Now';
        }
        break;
    }
  }

  public defineError() {
    this.error = {
      title: '',
      icon: '',
      msg: '',
    };
  }
}
