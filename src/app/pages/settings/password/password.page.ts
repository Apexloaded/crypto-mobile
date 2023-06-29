import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { UtilitiesService, AuthService } from 'src/app/services';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage implements OnInit {
  @Input() isForgot?: boolean = false;
  @Input() email?: string;

  public resetForm: FormGroup = this.fields();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private utilService: UtilitiesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.resetForm = this.fields();
    if (!this.isForgot && this.resetForm) {
      this.resetForm.controls['oldPassword'].setValidators(
        Validators.required
      );
    } else {
      this.resetForm.addControl('email', new FormControl(this.email));
    }
  }

  back() {
    if (this.isForgot) {
      this.modalCtrl.dismiss();
      return;
    }
    this.router.navigateByUrl('/settings');
  }

  fields() {
    return this.formBuilder.group({
      oldPassword: new FormControl(null, {
        updateOn: 'change',
      }),
      password: new FormControl('', {
        updateOn: 'change',
        validators: [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
        ],
      }),
      cPassword: new FormControl('', {
        updateOn: 'change',
        validators: [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
        ],
      }),
    });
  }

  reset() {
    if (!this.resetForm.valid) {
      return this.utilService.presentToast('Enter all fields', 3000);
    }

    if (
      this.resetForm.controls['password'].value !=
      this.resetForm.controls['cPassword'].value
    ) {
      return this.utilService.presentToast(
        'Password mismatch, kindly check.',
        3000
      );
    }

    if (this.isForgot) {
      return this.forgotPassword();
    } else {
      return this.resetPassword();
    }
  }

  private resetPassword() {
    this.utilService.presentLoading('circles').then(() => {
      const data = this.resetForm.value;
      const user = this.authService.getUser();
      this.authService
        .resetPassword(data, user.id)
        .then((res) => {
          this.resetForm.reset();
          this.utilService.dismisLoadCtrl();
          this.utilService.presentToast(res?.message, 3000);
          // if(!this.isForgot) {
          //   this.authService.userLogOut().subscribe();
          // }
        })
        .catch((error) => {
          this.utilService.dismisLoadCtrl();
          if (error.name === 'HttpErrorResponse' && error.status == 0) {
            this.utilService.presentToast('Error from our end', 3000);
            return;
          }
          this.utilService.presentToast(error.message, 3000);
        });
    });
  }

  private forgotPassword() {
    this.utilService.presentLoading('circles').then(() => {
      const data = {
        data: this.resetForm.value,
        type: 'forgot',
      };
      this.authService
        .resetPassword(data)
        .then((res) => {
          this.resetForm.reset();
          this.utilService.dismisLoadCtrl();
          this.modalCtrl.dismiss();
          this.utilService.presentToast(res?.message, 3000);
          this.router.navigateByUrl('/login');
        })
        .catch((error) => {
          this.utilService.dismisLoadCtrl();
          if (error.name === 'HttpErrorResponse' && error.status == 0) {
            this.utilService.presentToast('Error from our end', 3000);
            return;
          }
          this.utilService.presentToast(error.message, 3000);
        });
    });
  }
}
