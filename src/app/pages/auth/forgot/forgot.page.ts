import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ModalOptions } from '@ionic/angular';
import { OtpFormComponent } from 'src/app/components/otp-form/otp-form.component';
import { ModalOptionsInterface } from 'src/app/interface/modal-options.interface';
import { UtilitiesService, AuthService } from 'src/app/services';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private utilService: UtilitiesService,
    private authService: AuthService
  ) {}

  public form: FormGroup = this.fb.group({
    email: new FormControl(null, {
      updateOn: 'change',
      validators: [Validators.email, Validators.required],
    }),
  });

  ngOnInit() {}

  public back() {
    this.router.navigateByUrl('/login');
  }

  public submit() {
    if (!this.form.valid) {
      this.utilService.presentToast('Enter your email address', 3000);
      return;
    }

    this.utilService.presentLoading('circles').then(() => {
      const data = this.form.value;
      this.authService
        .forgotPassword(data)
        .then((res) => {
          const data = {
            type: 'forgot',
            email: res?.data,
          };
          this.form.reset();
          this.utilService.dismisLoadCtrl();
          this.utilService.presentToast(res?.message, 3000);
          const modalProps: ModalOptions = {
            component: OtpFormComponent,
            componentProps: {
              data: data,
            },
            cssClass: 'otp-modal',
            backdropDismiss: false,
          };
          this.utilService.presentModal(modalProps);
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
