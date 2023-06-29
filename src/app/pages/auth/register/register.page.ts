import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilitiesService, AuthService } from 'src/app/services';
import { Clipboard } from '@capacitor/clipboard';
import { Browser } from '@capacitor/browser';
import { EnvironmentService } from 'src/app/services/environment.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public form: FormGroup = this.buildForm();
  private env: any;

  constructor(
    private fb: FormBuilder,
    private utilService: UtilitiesService,
    private authService: AuthService,
    private router: Router,
    private envService: EnvironmentService,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.env = this.envService.environment;
  }

  public back() {
    this.router.navigateByUrl('/home');
  }

  public buildForm() {
    return this.fb.group({
      email: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.minLength(6)]
      }),
      ref_id: new FormControl(null, {
        updateOn: 'change',
      }),
      terms: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  public async pasteText() {
    const { type, value } = await Clipboard.read();
    this.form.controls['ref_id'].setValue(value);
  }

  public async initBrowser(path: string) {
    await Browser.open({ url: `${this.env.hostname}/${path}` });
  }

  public register() {
    if(this.form.controls['email'].invalid) {
      this.utilService.presentToast('Email address is required', 3000)
    }

    if(this.form.controls['password'].invalid) {
      this.utilService.presentToast('Password is empty or less than 6', 3000);
    }

    if(this.form.controls['terms'].invalid) {
      this.utilService.presentToast('Check the terms and conditions', 3000);
    }

    if(this.form.valid) {
      this.utilService.presentLoading('circular')
      .then(l => {
        const data = {
          email: this.form.controls['email'].value,
          password: this.form.controls['password'].value,
          referrer: this.form.controls['ref_id'].value
        };
        this.authService.creatCustomer(data).subscribe(
          res => {
            this.utilService.dismisLoadCtrl();
            this.form.reset();
            this.router.navigate(['/']);
            return;
          },
          err => {
            this.utilService.dismisLoadCtrl();
            if(err.name === 'HttpErrorResponse' && err.status == 0) {
              this.utilService.presentToast('Error from our end', 3000);
              return;
            }
            if(err.errors.email) {
              this.utilService.presentToast(err.errors.email[0], 3000);
              return;
            }
            if(err.errors.password) {
              this.utilService.presentToast(err.errors.password[0], 3000);
              return;
            }
          }
        );
      });
    }
  }
}
