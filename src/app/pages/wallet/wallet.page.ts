import { Component, OnInit } from '@angular/core';
import { WalletDetailsComponent } from 'src/app/components/wallet-details/wallet-details.component';
import { User, errorResponse } from 'src/app/interface';
import { AuthService, UtilitiesService, WalletService } from 'src/app/services';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  public user: User | undefined;
  public isLoading: boolean = true;
  public userWallet: any;
  public totalBal: string = '';
  public error: errorResponse | undefined;

  constructor(
    private utilService: UtilitiesService,
    private wallet: WalletService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.defineError();
  }

  ionViewWillEnter() {
    this.user = this.authService.getUser();
    this.getWallet();
  }

  private async getWallet() {
    await this.wallet.recordRetrieve(`?user_id=${this.user?.id}`)
    .then(result => {
      this.isLoading = false;
      this.userWallet = result?.data.wallet;
      this.totalBal = result?.data.totalBal;
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
    });
  }

  viewDetails(wallet: string, totalBal: string, walletId: string, type: string) {
    const props = {
      type: type,
      wallet: {
        address: wallet,
        id: walletId
      },
      totalBal
    }
    
    const walletDetails = this.utilService.noPresentModal(WalletDetailsComponent, props);
    walletDetails.then(el => {
      el.onDidDismiss().then(() => {
        this.getWallet();
      })
      el.present();
    })
  }

  public defineError() {
    this.error = {
      title: '',
      icon: '',
      msg: ''
    }
  }

}
