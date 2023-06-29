import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { EnvironmentService } from 'src/app/services/environment.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.page.html',
  styleUrls: ['./general.page.scss'],
})
export class GeneralPage implements OnInit {
  HOSTNAME;
  constructor(private router: Router, private envService: EnvironmentService) {
    this.HOSTNAME = this.envService.environment.hostname;
  }

  ngOnInit() {}

  public back() {
    this.router.navigateByUrl('/settings');
  }

  public async initBrowser(path: string) {
    await Browser.open({ url: `${this.HOSTNAME}/${path}` });
  }
}
