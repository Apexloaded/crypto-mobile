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
  public editMobile: FormGroup;
  public editAddress: FormGroup;
  public editGender: FormGroup;
  public editCountry: FormGroup;
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
    this.editMobile = this.buildEditMobile();
    this.editAddress = this.buildEditAddress();
    this.editCountry = this.buildEditCountry();
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

  /**
   * EDIT MOBILE FUNCTIONS
   * @returns form
   */
  buildEditMobile() {
    const form = this.fb.group({
      mobile: new FormControl(this.user.phone, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
    });
    this.isLoading = false;
    return form;
  }

  sendEditMobile() {
    if (!this.editMobile.valid) {
      this.utilService.presentToast(
        'Please enter your mobile phone number',
        3000
      );
      return;
    }

    const data = {
      phone: `${this.editMobile.controls['mobile'].value}`,
    };

    this.sendReq(data, this.user.id);
  }

  /**
   * EDIT ADDRESS FUNCTIONS
   * @returns form
   */
  buildEditAddress() {
    const form = this.fb.group({
      address: new FormControl(this.user.address, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
    });
    this.isLoading = false;
    return form;
  }

  sendEditAddress() {
    if (!this.editAddress.valid) {
      this.utilService.presentToast('Please enter your address', 3000);
      return;
    }

    const data = {
      address: `${this.editAddress.controls['address'].value}`,
    };

    this.sendReq(data, this.user.id);
  }

  /**
   * EDIT ADDRESS FUNCTIONS
   * @returns form
   */
  buildEditCountry() {
    const form = this.fb.group({
      nationality: new FormControl(this.user.nationality, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
    });
    this.isLoading = false;
    return form;
  }

  sendEditCountry() {
    if (!this.editCountry.valid) {
      this.utilService.presentToast('Please fill in your country', 3000);
      return;
    }

    const data = {
      nationality: `${this.editCountry.controls['nationality'].value}`,
    };

    this.sendReq(data, this.user.id);
  }

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
    switch (this.data) {
      case 'edit-name':
        this.sendEditName();
        break;
      case 'edit-email':
        this.sendEditEmail();
        break;
      case 'mobile-phone':
        this.sendEditMobile();
        break;
      case 'edit-gender':
        this.sendEditGender();
        break;
      case 'edit-address':
        this.sendEditAddress();
        break;
      case 'edit-country':
        this.sendEditCountry();
        break;
    }
  }
}
