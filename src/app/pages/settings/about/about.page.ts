import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  public appDetails: any = {
    name: null,
    versionCode: null,
    versionNum: null,
    packageName: null,
  };

  constructor(
    private router: Router,
    private platform: Platform,
    private appVersion: AppVersion
  ) {
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

  ngOnInit() {}

  back() {
    this.router.navigateByUrl('/settings');
  }
}
