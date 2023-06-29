import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilitiesService, AuthService } from 'src/app/services';
import { Clipboard } from '@capacitor/clipboard';
import { ProfilePopoverComponent } from 'src/app/components/profile-popover/profile-popover.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public user;
  public isLoading: boolean = false;

  constructor(
    private utilServices: UtilitiesService,
    private router: Router,
    private authService: AuthService,
  ) { 
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  ionViewWillEnter() {
    this.user = this.authService.getUser();
  }

  async openModal(ev: any) {
    this.utilServices.presentPopover(ev, ProfilePopoverComponent);
  }

  public back():void {
    this.router.navigateByUrl('/home');
  }

  public async copy(id?: string) {
    await Clipboard.write({
      string: id,
    });
    this.utilServices.presentToast('ID Copied Successfully', 3000);
  }

}
