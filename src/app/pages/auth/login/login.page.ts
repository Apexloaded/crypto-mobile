import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalOptions } from '@ionic/angular';
import { OtpFormComponent } from 'src/app/components/otp-form/otp-form.component';
import { UtilitiesService, AuthService } from 'src/app/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @Input() data?: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private utilService: UtilitiesService,
    private authService: AuthService,
  ) { }

  public form: FormGroup = this.buildForm();

  ngOnInit() {
    this.data = this.data ? this.data : false;
    this.buildForm();
  }

  protected buildForm() {
    return this.form = this.fb.group({
      email: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.minLength(6), Validators.required]
      })
    });
  }

  public back() {
    this.router.navigateByUrl('/home');
  }

  public login() {
    if(this.data.isModal) {
      this.utilService.presentToast(this.data.isModal, 3000);
      this.utilService.dismisModal();
    } else {
      this.hitLoginApi();
    }
  }

  hitLoginApi() {
    if(this.form.controls['email'].invalid) {
      this.utilService.presentToast('Email address is required', 3000)
    }

    if(this.form.controls['password'].invalid) {
      this.utilService.presentToast('Password is empty or less than 6', 3000);
    }

    if(this.form.valid) {
      this.utilService.presentLoading('circular')
      .then(l => {
        const data = {
          email: this.form.controls['email'].value,
          password: this.form.controls['password'].value,
        };
        this.authService.postLogin(data)
        .then(
          (res:any) => {
            this.utilService.dismisLoadCtrl();
            if(res.data == "otp") {
              const modalProps: ModalOptions = {
                component: OtpFormComponent,
                componentProps: {
                  data: data,
                },
                cssClass: 'otp-modal',
                backdropDismiss: false,
              };
              this.utilService.presentModal(modalProps);
              this.utilService.presentToast(res.message, 3000);
              return;
            }
            this.form.reset();
            this.router.navigate(['/']);
            return;
          }
        )
        .catch(error => {
          this.utilService.dismisLoadCtrl();
          if(error.name === 'HttpErrorResponse' && error.status == 0) {
            this.utilService.presentToast('Error from our end', 3000);
            return;
          }
          this.utilService.presentToast(error.message, 3000);
        });
      });
    }
  }
}
