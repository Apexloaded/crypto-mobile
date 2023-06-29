import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { appMenu } from 'src/app/helpers/app-menu';
import { Menu, User } from 'src/app/interface';
import { AuthService, UtilitiesService, WalletService } from 'src/app/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public menus: Array<Menu> = appMenu;
  public totalBal: number = 0;
  public isLoading: Boolean = true;
  public user: User | undefined = undefined;

  constructor(
    private router: Router,
    private utilService: UtilitiesService,
    private authService: AuthService,
    private wallet: WalletService
  ) {}

  ngOnInit() {}

  async getRecords() {
    return await this.wallet.recordRetrieve(`?user_id=${this.user?.id}`);
  }

  async getBalance() {
    await this.getRecords()
      .then((result) => {
        this.isLoading = false;
        this.totalBal = result?.data.totalBal;
      })
      .catch((error) => {
        this.isLoading = false;
        if (error.status && error.message === 'No wallet found') {
          this.router.navigateByUrl('/app/wallet/new');
        }
        this.utilService.displayError(error);
      });
  }

  ionViewWillEnter() {
    this.user = this.authService.getUser();
    this.getBalance();
  }

  public open(menu: Menu) {
    if (menu.type === 'menu') {
      this.router.navigateByUrl(`${menu.url}`);
      return;
    }

    this.utilService.presentAlert('Logout', 'Do you want to log out?', () => {
      // Remove auth
      this.authService.userLogOut().subscribe(
        (res) => {},
        (error) => {
          if (error.name === 'HttpErrorResponse' && error.status == 0) {
            this.utilService.presentToast('Error from our end', 3000);
            return;
          }
        }
      );
    });
  }

  public refresh(event: any) {
    this.isLoading = true;
    this.getRecords()
      .then((result) => {
        this.isLoading = false;
        this.totalBal = result?.data.totalBal;
        event.target.complete();
      })
      .catch((error) => {
        this.isLoading = false;
        if (error.status && error.message === 'No wallet found') {
          this.router.navigateByUrl('/app/wallet/new');
        }
        this.utilService.displayError(error);
        event.target.complete();
      });
  }
}
