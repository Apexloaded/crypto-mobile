import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Clipboard } from '@capacitor/clipboard';
import { TransactionInterface } from 'src/app/interface/transaction.interface';
import { TransactionService, UtilitiesService } from 'src/app/services';
import { PreviousRouteService } from 'src/app/services/previous-route.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  private previousRoute: string = '/home';
  public routeArray: Array<any> = [];
  public isLoading = true;
  public transaction?: TransactionInterface;

  constructor(
    private router: Router,
    private prevRoute: PreviousRouteService,
    private utilService: UtilitiesService,
    private activeRoute: ActivatedRoute,
    private transactionProv: TransactionService
  ) {}

  ngOnInit() {
    this.activeRoute.paramMap.subscribe((res) => {
      const id = res.get('id');
      this.transactionProv
        .getSingleRecord(`${id}`)
        .then((res) => {
          this.isLoading = false;
          this.transaction = res?.data;
        })
        .catch((error) => {});
    });
  }

  ionViewWillEnter() {
    this.previousRoute = this.prevRoute.getPreviousRoute;
    this.routeArray.push(this.previousRoute);
    this.previousRoute = this.routeArray[0];
  }

  public async copy(id?: string) {
    await Clipboard.write({
      string: id,
    });
    this.utilService.presentToast('Transaction ID Copied', 3000);
  }

  public back(): void {
    const checkPrev = (route: string) => {
      const isWithdrawalRoute = route.includes('/details');
      return isWithdrawalRoute ? '/home' : route;
    };
    const route = this.previousRoute ? checkPrev(this.previousRoute) : '/home';
    this.router.navigateByUrl(`${route}`);
  }
}
