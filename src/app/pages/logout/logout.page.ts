import { Component, OnInit } from '@angular/core';
import { UtilitiesService, AuthService } from 'src/app/services';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {
  constructor(
    private utilService: UtilitiesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.utilService.presentAlert('Logout', 'Do you want to log out?', () => {
      // Remove auth
      this.authService.userLogOut();
    });
  }
}
