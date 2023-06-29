import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Platform } from '@ionic/angular';
import { User } from 'src/app/interface';
import { AuthService, UtilitiesService } from 'src/app/services';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public emailAuth;
  public user: User;
  public appDetails: any = {
    name: null,
    versionCode: null,
    versionNum: null,
    packageName: null,
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private utilService: UtilitiesService,
    private appVersion: AppVersion,
    private platform: Platform
  ) {
    this.user = this.authService.getUser();
    this.emailAuth = this.authService.getEmailAuth();
    this.platform.ready().then(() => {
      this.appVersion
        .getAppName()
        .then((response) => {
          this.appDetails.name = response;
        })
        .catch((err) => {
          alert(err);
        });

      this.appVersion
        .getVersionNumber()
        .then((response) => {
          this.appDetails.versionNum = response;
        })
        .catch((err) => {
          alert(err);
        });

      this.appVersion
        .getVersionCode()
        .then((response) => {
          this.appDetails.versionCode = response;
        })
        .catch((err) => {
          alert(err);
        });

      this.appVersion
        .getPackageName()
        .then((response) => {
          this.appDetails.packageName = response;
        })
        .catch((err) => {
          alert(err);
        });
    });
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.authService.getOtp(this.user.id).subscribe(() => {
      this.emailAuth = this.authService.getEmailAuth();
    });
  }

  ionViewWillEnter() {
    this.getEmailAuthMode();
  }

  getEmailAuthMode() {
    this.emailAuth = this.authService.getEmailAuth();
    if (!this.emailAuth) {
      this.user = this.authService.getUser();
      this.authService.getOtp(this.user.id).subscribe(() => {
        this.emailAuth = this.authService.getEmailAuth();
      });
    }
  }

  public back() {
    this.router.navigateByUrl('/home');
  }

  public async initBrowser() {
    const browser = await Browser.open({
      url: 'https://apexloaded.com',
    });
  }

  public toggleAuth() {
    let data: any = {
      is_enabled: null,
    };
    if (this.emailAuth) {
      data.is_enabled = '0';
    } else {
      data.is_enabled = '1';
    }

    this.utilService.presentLoading('circles').then(() => {
      this.authService.updateOtp(data, this.user.id).subscribe(
        (res) => {
          this.utilService.dismisLoadCtrl();
          this.utilService.presentToast(res.message, 3000);
        },
        (error) => {
          this.utilService.dismisLoadCtrl();
          this.utilService.presentToast(error.message, 3000);
        }
      );
    });
  }
}
