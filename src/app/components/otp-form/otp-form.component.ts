import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { PasswordPage } from 'src/app/pages/settings/password/password.page';
import { UtilitiesService, AuthService } from 'src/app/services';

@Component({
  selector: 'app-otp-form',
  templateUrl: './otp-form.component.html',
  styleUrls: ['./otp-form.component.scss'],
})
export class OtpFormComponent  implements OnInit {
  @Input() data: any;

  constructor(
    private utilService: UtilitiesService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private modalCtrl: ModalController
  ) { }

  public form: FormGroup = this.buildForm();
  ngOnInit() {
    this.buildForm();
  }

  protected buildForm() {
    return this.form = this.fb.group({
      otp: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  public back() {
    this.utilService.dismisModal();
  }

  public resendOTP() {
    this.utilService.presentLoading('circles')
      .then(l => {
        const data = {
          email: this.data.email,
        };
        this.authService.requestOTPByEmail(data)
        .subscribe(
          res => {
            this.utilService.dismisLoadCtrl();
            this.utilService.presentToast(res.message, 3000);
          },
          error => {
            this.utilService.dismisLoadCtrl();
            this.utilService.presentToast(error.message, 3000);
          }
        );
      })
  }

  public login() {
    if(this.form.controls['otp'].invalid) {
      this.utilService.presentToast('otp is required', 3000)
    }

    if(this.form.valid) {
      switch(this.data.type) {
        case 'forgot':
          this.forgetLogin(this.data.email);
          break;
        default: 
          this.otpLogin();
          break;
      }
    }
  }

  private otpLogin() {
    this.utilService.presentLoading('circles')
    .then(l => {
      const data = {
        email: this.data.email,
        password: this.data.password,
        otp: this.form.controls['otp'].value
      };
      this.authService.postLogin(data)
      .then(
        res => {
          this.utilService.dismisModal();
          this.utilService.dismisLoadCtrl();
          this.form.reset();
          this.router.navigate(['/']);
          return;
        }
      )
      .catch(err => {
        this.utilService.dismisLoadCtrl();
        this.utilService.presentToast(err.message, 3000);
      });
    });
  }

  private forgetLogin(email: string) {
    this.utilService.presentLoading('circles')
    .then(l => {
      const data = {
        email: email,
        type: 'verify',
        token: this.form.controls['otp'].value
      };
      this.authService.forgotPassword(data)
      .then(
        res => {
          this.utilService.dismisModal();
          this.utilService.dismisLoadCtrl();
          this.form.reset();
          const data = {
            isForgot: true,
            email: email
          };
          this.modalCtrl.create({
            component: PasswordPage,
            componentProps: data
          }).then(el => el.present());
          return;
        }
      )
      .catch(err => {
        this.utilService.dismisLoadCtrl();
        this.utilService.presentToast(err.message, 3000);
      });
    });
  }

}
