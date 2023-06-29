import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalOptions } from '@ionic/angular';
import { ProfileEditComponent } from 'src/app/components/profile-edit/profile-edit.component';
import { User } from 'src/app/interface';
import { AuthService, UtilitiesService } from 'src/app/services';
import { PreviousRouteService } from 'src/app/services/previous-route.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  private routeArray: any = [];
  public previousRoute: string = '/home';
  public user: User;
  public isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private utilService: UtilitiesService,
    private prevRoute: PreviousRouteService,
    private router: Router
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.user = this.authService.getUser();
    this.previousRoute = this.prevRoute.getPreviousRoute;
    this.routeArray.push(this.previousRoute);
    this.previousRoute = this.routeArray[0];
  }

  public back(): void {
    this.router.navigateByUrl(`${this.previousRoute}`);
  }

  editName() {
    this.presentPopover('edit-name');
  }

  editGender() {
    if (this.user.gender) {
      return;
    }
    this.presentPopover('edit-gender');
  }

  editEmail() {
    this.presentPopover('edit-email');
  }

  mobilePhone() {
    this.presentPopover('mobile-phone');
  }

  editAddress() {
    this.presentPopover('edit-address');
  }

  editCountry() {
    this.presentPopover('edit-country');
  }

  presentPopover(type: string) {
    const modalOpt: ModalOptions = {
      component: ProfileEditComponent,
      componentProps: {
        data: type,
      },
    };
    this.utilService.presentModal(modalOpt);
  }
}
