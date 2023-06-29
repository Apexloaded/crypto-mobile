import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { AuthService, UtilitiesService } from 'src/app/services';

@Component({
  selector: 'app-profile-popover',
  templateUrl: './profile-popover.component.html',
  styleUrls: ['./profile-popover.component.scss'],
})
export class ProfilePopoverComponent  implements OnInit {

  constructor(
    private popoverCtrl: PopoverController,
    private authService: AuthService,
    private router: Router,
    private utilService: UtilitiesService
  ) { }

  ngOnInit() {}

  logout() {
    this.popoverCtrl.dismiss();
    this.utilService.presentAlert('Logout', 'Do you want to log out?', () => {
      // Remove auth
      this.authService.userLogOut()
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
        }
      )
    });
  }

  editProfile() {
    this.popoverCtrl.dismiss();
    this.router.navigateByUrl('/profile/edit');
  }

}
