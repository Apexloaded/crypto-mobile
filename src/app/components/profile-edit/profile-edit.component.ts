import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from 'src/app/interface';
import { AuthService, UtilitiesService } from 'src/app/services';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit {
  @Input() data: any;

  public editName: FormGroup;
  public editEmail: FormGroup;
  // public editMobile: FormGroup;
  // public editAddress: FormGroup;
  public editGender: FormGroup;
  // public editCountry: FormGroup;
  public user: User;
  public isLoading: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private utilService: UtilitiesService
  ) {
    this.isLoading = true;
    this.user = this.authService.getUser();

    this.editName = this.buildEditName();
    this.editEmail = this.buildEditEmail();
    this.editGender = this.buildEditGender();
    console.log('Initialized Constructor');
    // switch (this.data) {
    //   case 'edit-name':
    //     this.editName = this.buildEditName(this.user);
    //     break;
    //   case 'edit-gender':
    //     this.buildEditGender(this.user, true);
    //     break;
    //   case 'edit-email':
    //     this.buildEditEmail(this.user, true);
    //     break;
    //   case 'mobile-phone':
    //     this.buildEditMobile(this.user, true);
    //     break;
    //   case 'edit-address':
    //     this.buildEditAddress(this.user, true);
    //     break;
    //   case 'edit-country':
    //     this.buildEditCountry(this.user, true);
    //     break;
    // }
  }

  ngOnInit() {
    //this.isLoading = true;
    this.user = this.authService.getUser();
  }

  public back(): void {
    this.utilService.dismisModal();
  }

  /**
   * EDIT NAME FUNCTIONS
   * @returns form
   */
  buildEditName() {
    const form = this.fb.group({
      first_name: new FormControl(this.user.first_name, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
      last_name: new FormControl(this.user.last_name, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
    });
    this.isLoading = false;
    return form;
  }

  sendEditName() {
    if (!this.editName.valid) {
      this.utilService.presentToast('Please fill in all fields', 3000);
      return;
    }
    const data = {
      first_name: `${this.editName.controls['first_name'].value}`,
      last_name: `${this.editName.controls['last_name'].value}`,
    };
    this.sendReq(data, this.user.id);
  }

  /**
   * EDIT EMAIL FUNCTIONS
   * @returns form
   */
  buildEditEmail() {
    const form = this.fb.group({
      email: new FormControl(this.user.email, {
        updateOn: 'change',
        validators: [Validators.required, Validators.email],
      }),
    });
    this.isLoading = false;
    return form;
  }

  sendEditEmail() {
    if (!this.editEmail.valid) {
      this.utilService.presentToast('Please enter your email address', 3000);
      return;
    }
    const data = {
      email: `${this.editEmail.controls['email'].value}`,
    };
    this.sendReq(data, this.user.id);
  }

  /**
   * EDIT GENDER FUNCTIONS
   * @returns form
   */
  buildEditGender() {
    const form = this.fb.group({
      gender: new FormControl(this.user.gender, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
    });
    this.isLoading = false;
    return form;
  }

  sendEditGender() {
    if (!this.editGender.valid) {
      this.utilService.presentToast('Select your gender', 3000);
      return;
    }
    const data = {
      gender: `${this.editGender.controls['gender'].value}`,
    };
    this.sendReq(data, this.user.id);
  }

  // buildEditMobile(value, isBuild: boolean) {
  //   if (isBuild) {
  //     this.editMobile = this.fb.group({
  //       mobile: new FormControl(value.phone, {
  //         updateOn: 'change',
  //         validators: [Validators.required],
  //       }),
  //     });
  //     this.isLoading = false;
  //     return;
  //   }

  //   if (!this.editMobile.valid) {
  //     this.utilService.presentToast(
  //       'Please enter your mobile phone number',
  //       3000
  //     );
  //     return;
  //   }

  //   const data = {
  //     phone: `${this.editMobile.controls['mobile'].value}`,
  //   };

  //   this.sendReq(data, value.id);
  // }

  // buildEditAddress(value, isBuild: boolean) {
  //   if (isBuild) {
  //     this.editAddress = this.fb.group({
  //       address: new FormControl(value.address, {
  //         updateOn: 'change',
  //         validators: [Validators.required],
  //       }),
  //     });
  //     this.isLoading = false;
  //     return;
  //   }

  //   if (!this.editAddress.valid) {
  //     this.utilService.presentToast('Please enter your address', 3000);
  //     return;
  //   }

  //   const data = {
  //     address: `${this.editAddress.controls['address'].value}`,
  //   };

  //   this.sendReq(data, value.id);
  // }

  // buildEditCountry(value, isBuild: boolean) {
  //   if (isBuild) {
  //     this.editCountry = this.fb.group({
  //       nationality: new FormControl(value.nationality, {
  //         updateOn: 'change',
  //         validators: [Validators.required],
  //       }),
  //     });
  //     this.isLoading = false;
  //     return;
  //   }

  //   if (!this.editCountry.valid) {
  //     this.utilService.presentToast('Please fill in your country', 3000);
  //     return;
  //   }

  //   const data = {
  //     nationality: `${this.editCountry.controls['nationality'].value}`,
  //   };

  //   this.sendReq(data, value.id);
  // }

  sendReq(data: any, id: string) {
    this.utilService.presentLoading('circles').then(() => {
      this.authService
        .updateUser(data, id)
        .then((res) => {
          this.utilService.dismisLoadCtrl();
          if (res?.status) {
            this.utilService.presentToast('Update successful', 3000);
            this.isLoading = false;
            return;
          }
          this.utilService.presentToast(
            "We couldn't process your request",
            3000
          );
        })
        .catch((err) => {
          this.utilService.dismisLoadCtrl();
          this.isLoading = false;
          this.utilService.presentToast(
            'An error occurred, please try again',
            3000
          );
        });
    });
  }

  updateBtn() {
    // switch (this.type) {
    //   case 'edit-name':
    //     this.buildEditName(this.user, false);
    //     break;
    //   case 'edit-email':
    //     this.buildEditEmail(this.user, false);
    //     break;
    //   case 'mobile-phone':
    //     this.buildEditMobile(this.user, false);
    //     break;
    //   case 'edit-gender':
    //     this.buildEditGender(this.user, false);
    //     break;
    //   case 'edit-address':
    //     this.buildEditAddress(this.user, false);
    //     break;
    //   case 'edit-country':
    //     this.buildEditCountry(this.user, false);
    //     break;
    // }
  }
}
